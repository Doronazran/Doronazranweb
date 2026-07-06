// Vercel Serverless Function: contact form -> email.
// POST /api/contact  { name, email, message, inquiry?, company?, _hp? }
//
// Sends the inquiry to CONTACT_TO (default Doronazran@gmail.com).
// Primary: Resend (set RESEND_API_KEY). Fallback: FormSubmit (needs one-time
// activation on the target inbox). Returns { ok:true } on success.

const CONTACT_TO = process.env.CONTACT_TO || 'Doronazran@gmail.com'

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
}

export default async function handler(req, res) {
  // Safe config diagnostic (booleans only) -> GET /api/contact?debug=1
  if (req.method === 'GET') {
    const debug = (req.query && (req.query.debug === '1')) || (req.url && req.url.includes('debug=1'))
    if (debug) {
      return res.status(200).json({
        hasResendKey: !!process.env.RESEND_API_KEY,
        contactTo: CONTACT_TO,
        contactFrom: process.env.CONTACT_FROM || 'onboarding@resend.dev (default)',
      })
    }
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  body = body || {}

  const { name, email, message, inquiry, company, _hp } = body

  // Honeypot: bots fill hidden fields — silently accept and drop.
  if (_hp) return res.status(200).json({ ok: true })

  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' })
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) return res.status(400).json({ error: 'Invalid email' })

  const subject = `${inquiry ? `[${inquiry}] ` : ''}פנייה חדשה מהאתר — ${name}`
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">פנייה חדשה מהאתר</h2>
      <p><strong>שם:</strong> ${esc(name)}</p>
      <p><strong>אימייל:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
      ${company ? `<p><strong>חברה:</strong> ${esc(company)}</p>` : ''}
      ${inquiry ? `<p><strong>נושא הפנייה:</strong> ${esc(inquiry)}</p>` : ''}
      <p><strong>הודעה:</strong></p>
      <p style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${esc(message)}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
      <p style="font-size:12px;color:#888">נשלח אוטומטית מטופס יצירת הקשר באתר.</p>
    </div>`

  // 1) Preferred: Resend
  let resendError = null
  const key = process.env.RESEND_API_KEY
  if (key) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || 'Doron Azran Website <onboarding@resend.dev>',
          to: [CONTACT_TO],
          reply_to: email,
          subject,
          html,
        }),
      })
      if (r.ok) return res.status(200).json({ ok: true, via: 'resend' })
      resendError = `${r.status}: ${(await r.text().catch(() => '')).slice(0, 300)}`
      console.error('[contact] Resend failed', resendError)
    } catch (e) {
      resendError = String(e?.message || e)
      console.error('[contact] Resend error', resendError)
    }
  } else {
    resendError = 'RESEND_API_KEY not set'
  }

  // 2) Fallback: FormSubmit (activate once by clicking the link it emails you)
  try {
    const r = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(CONTACT_TO), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name, email, message,
        inquiry: inquiry || '',
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
      }),
    })
    const data = await r.json().catch(() => ({}))
    if (data.success === 'true' || data.success === true) {
      return res.status(200).json({ ok: true, via: 'formsubmit' })
    }
    console.error('[contact] FormSubmit response', data)
  } catch (e) {
    console.error('[contact] FormSubmit error', e?.message || e)
  }

  return res.status(502).json({ error: 'Email delivery failed.', resendError })
}
