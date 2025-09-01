import React, { useEffect, useState } from 'react'
import { Paper, Typography, List, ListItem, ListItemText, Link as MUILink } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { getAll } from '../lib/store.js'

export default function StatsPage() {
  const [items, setItems] = useState([])
  useEffect(() => { setItems(getAll()) }, [])
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Statistics</Typography>
      <List>
        {items.map((it, idx) => (
          <ListItem key={idx} divider>
            <ListItemText
              primary={
                <MUILink component={RouterLink} to={new URL(it.short).pathname} underline="hover">
                  {it.short}
                </MUILink>
              }
              secondary={`Created: ${it.createdAt} | Expires: ${it.expiresAt} | Clicks: ${it.clicks}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
