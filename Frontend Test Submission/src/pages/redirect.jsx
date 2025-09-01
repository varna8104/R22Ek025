import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Log } from '../lib/log.js'
import { getAll, setAll } from '../lib/store.js'
import { Box, CircularProgress, Typography, Link as MUILink } from '@mui/material'

const TOKEN_KEY = 'log_token'

export default function RedirectPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [dest, setDest] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function run() {
      const token = localStorage.getItem(TOKEN_KEY) || ''
      const all = getAll()
      const idx = all.findIndex(x => x.short && x.short.endsWith('/' + code))
      if (idx === -1) {
        setNotFound(true)
  await Log('warn', 'page', 'code not found', token)
        setTimeout(() => navigate('/', { replace: true }), 1200)
        return
      }
      const item = { ...all[idx] }
      item.clicks = (item.clicks || 0) + 1
      item.events = [...(item.events || []), { ts: Date.now(), source: 'app', geo: 'unknown' }]
      all[idx] = item
      setAll(all)
      await Log('info', 'page', 'redirect', token)
      const url = (() => {
        try {
          const u = new URL(item.long)
          return u.toString()
        } catch {
          return 'https://' + String(item.long)
        }
      })()
      setDest(url)
      setTimeout(() => {
        try { window.location.replace(url) } catch {}
      }, 10)
      setTimeout(() => {
        if (document.visibilityState === 'visible' && location.href.includes('/s/')) {
          try { window.location.assign(url) } catch {}
        }
      }, 400)
    }
    run()
  }, [code, navigate])

  if (notFound) {
    return (
      <Box sx={{ px: 3, py: 6, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Shortcode not found</Typography>
        <Typography variant="body2">
          Returning to <MUILink href="/">home</MUILink>…
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ px: 3, py: 6, textAlign: 'center' }}>
      <CircularProgress size={28} sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>Redirecting</Typography>
      {dest && (
        <Typography variant="body2">
          If nothing happens, <MUILink href={dest}>click here</MUILink>.
        </Typography>
      )}
    </Box>
  )
}
