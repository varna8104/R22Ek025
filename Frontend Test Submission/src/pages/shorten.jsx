import React, { useMemo, useState } from 'react' 
import { Box, Grid, Paper, TextField, Button, Typography, Link as MUILink } from '@mui/material'
import { Log } from '../lib/log.js'
import { add, getAll } from '../lib/store.js'

const TOKEN_KEY = 'log_token'

function normalizeUrl(v) {
  try { return new URL(v).toString() } catch { return '' }
}

function minutes(v) {
  const n = Number(v)
  return Number.isInteger(n) && n > 0 ? n : 30
}

function codeValid(v) {
  return !v || /^[a-zA-Z0-9_-]{3,30}$/.test(v)
}

export default function ShortenPage() {
  const [rows, setRows] = useState([{ url: '', ttl: '', code: '' }])
  const [sending, setSending] = useState(false)

  function addRow() {
    if (rows.length >= 5) return
    setRows([...rows, { url: '', ttl: '', code: '' }])
  }

  function update(i, key, val) {
    const next = rows.slice()
    next[i] = { ...next[i], [key]: val }
    setRows(next)
  }

  function uniqueCode(desired) {
    const all = getAll()
    const has = c => all.some(x => x.short && x.short.endsWith('/' + c))
    let code = desired && codeValid(desired) ? desired : Math.random().toString(36).slice(2, 8)
    while (has(code)) {
      if (desired) {
        code = (desired + Math.random().toString(36).slice(2, 3)).slice(0, 30)
      } else {
        code = Math.random().toString(36).slice(2, 8)
      }
    }
    return code
  }

  async function submit() {
    setSending(true)
    const token = localStorage.getItem(TOKEN_KEY) || ''
    const payloads = rows
      .map(r => ({ url: normalizeUrl(r.url), ttl: minutes(r.ttl), code: r.code }))
      .filter(r => r.url && codeValid(r.code))
      .slice(0, 5)

    for (const p of payloads) {
      try {
        const code = uniqueCode(p.code)
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
        const shortUrl = `${origin}/s/${code}`
        const now = new Date()
        const createdAt = now.toISOString()
        const expiresAt = new Date(now.getTime() + p.ttl * 60000).toISOString()
        add({ long: p.url, short: shortUrl, createdAt, expiresAt, clicks: 0, events: [] })
        await Log('info', 'api', 'shorten success', token)
      } catch (e) {
        await Log('error', 'api', 'shorten failed', token)
      }
    }
    setSending(false)
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Shorten URLs</Typography>
      <Grid container spacing={2}>
        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <Grid item xs={12} md={6}>
              <TextField label="Long URL" fullWidth value={r.url} onChange={e => update(i, 'url', e.target.value)} />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField label="Validity (min)" fullWidth value={r.ttl} onChange={e => update(i, 'ttl', e.target.value)} />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField label="Shortcode (opt)" fullWidth value={r.code} onChange={e => update(i, 'code', e.target.value)} />
            </Grid>
            {i === 0 && (
              <Grid item xs={12} md={2}>
                <Button variant="contained" fullWidth disabled={sending} onClick={addRow}>Add</Button>
              </Grid>
            )}
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button variant="contained" onClick={submit} disabled={sending}>Create</Button>
            <TextField label="Log Token" size="small" sx={{ width: 420 }} defaultValue={localStorage.getItem(TOKEN_KEY) || ''} onBlur={e => localStorage.setItem(TOKEN_KEY, e.target.value.trim())} />
            <MUILink href="/stats" underline="hover">View stats →</MUILink>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}
