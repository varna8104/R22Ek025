import React, { useMemo } from 'react'
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material'
import ShortenPage from './pages/shorten.jsx'
import StatsPage from './pages/stats.jsx'
import RedirectPage from './pages/redirect.jsx'

export default function App() {
  const location = useLocation()
  const title = useMemo(() => {
    if (location.pathname.startsWith('/s/')) return 'Redirecting'
    if (location.pathname.startsWith('/stats')) return 'Statistics'
    return 'URL Shortener'
  }, [location.pathname])

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{title}</Typography>
          <Button color="inherit" component={Link} to="/" state={{ from: location.pathname }} sx={{ mr: 1 }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/stats" state={{ from: location.pathname }}>
            Stats
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Routes>
          <Route path="/" element={<ShortenPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/s/:code" element={<RedirectPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  )
}
