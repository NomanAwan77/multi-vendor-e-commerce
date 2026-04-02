import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import * as orderApi from '../../api/order.api'
import { ApiError } from '../../api/client'
import type { Order, Product } from '../../types/models'

function productLabel(p: Product | string): string {
  if (typeof p === 'object' && p && 'name' in p) return p.name
  return 'Product'
}

export function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await orderApi.getVendorOrders()
        if (!cancelled) {
          setOrders(res.vendorOrders)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError) setError(e.message)
          else setError('Failed to load vendor orders')
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
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Orders containing your products
      </Typography>
      {orders.length === 0 && (
        <Typography color="text.secondary">No matching orders yet.</Typography>
      )}
      {orders.map((o) => (
        <Card key={o._id} sx={{ mb: 2 }} elevation={1}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Order #{o._id}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {o.products.map((line, i) => (
              <Typography key={i} variant="body2">
                {productLabel(line.productId)} × {line.quantity ?? '—'}
              </Typography>
            ))}
            <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
              Customer order total: ${o.totalAmount?.toFixed(2) ?? '—'} (full order)
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
