import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import * as authApi from '../../api/auth.api'
import { ApiError } from '../../api/client'
import type { User } from '../../types/models'

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await authApi.getAllUsers()
        if (!cancelled) {
          setUsers(res.users)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError) setError(e.message)
          else setError('Failed to load users')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <Typography color="error" role="alert">
        {error}
      </Typography>
    )
  }

  return (
    <Paper elevation={0} sx={{ overflow: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ p: 2, pb: 0 }}>
        All users
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 2 }}>
        Listing from <code>GET /api/auth/getAllUsers</code>
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Store</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u._id ?? u.email}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>{u.storeName ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
