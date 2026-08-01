import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return { plugins: [react(), { name: 'assistant-api', configureServer(server) { server.middlewares.use('/api/assistant', async (req, res) => {
    if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
    let body = ''; for await (const chunk of req) body += chunk
    try { const { question, trips = [] } = JSON.parse(body) as { question: string; trips: unknown[] }; if (!env.GROQ_API_KEY) throw new Error('Missing GROQ_API_KEY. Add it to .env and restart the dev server.')
      const live = /\b(today|current|live|delay|delayed|status|price|prices|weather)\b/i.test(question) && !/\b(my|mine|saved)\b/i.test(question)
      let web = ''; if (live && env.TAVILY_API_KEY) { const r = await fetch('https://api.tavily.com/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ api_key: env.TAVILY_API_KEY, query: question, max_results: 5 }) }); if (r.ok) { const d = await r.json() as { results?: { title: string; content: string }[] }; web = (d.results ?? []).map((x) => `${x.title}: ${x.content}`).join('\n') } }
      const prompt = `You are TripPilot. Answer clearly and concisely. Saved trips: ${JSON.stringify(trips)}. ${web ? `Live web results: ${web}` : ''} User question: ${question}`
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: 'Never invent trip data. Say when information is unavailable.' }, { role: 'user', content: prompt }], temperature: 0.2 }) }); const d = await r.json() as { choices?: { message?: { content?: string } }[]; error?: { message?: string } }; if (!r.ok) throw new Error(d.error?.message || 'Groq request failed.'); res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ answer: d.choices?.[0]?.message?.content || 'No answer returned.', searched: Boolean(web) }))
    } catch (error) { res.statusCode = 500; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Assistant request failed.' })) }
  }) } }] }
})
