import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useCallback, useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import * as cartApi from '../api/cart.api'
import { ApiError } from '../api/client'
import type { Cart, Product } from '../types/models'

function lineProduct(p: Product | string): Product | null {
  if (typeof p === 'object' && p && '_id' in p) return p as Product
  return null
}

export function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setError(null)
    try {
      const res = await cartApi.getCart()
      setCart(res.cart)
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 404) setCart(null)
        else setError(e.message)
      } else setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const removeLine = async (productId: string) => {
    try {
      const res = await cartApi.removeFromCart(productId)
      setCart(res.cart)
    } catch (e) {
      if (e instanceof ApiError) setError(e.message)
    }
  }

  const clear = async () => {
    try {
      const res = await cartApi.clearCart()
      setCart(res.cart)
    } catch (e) {
      if (e instanceof ApiError) setError(e.message)
    }
  }

  if (loading) {
    return <Typography>Loading cart…</Typography>
  }

  if (error && !cart) {
    return (
      <Typography color="error" role="alert">
        {error}
      </Typography>
    )
  }

  if (!cart || cart.products.length === 0) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button component={RouterLink} to="/products" variant="contained">
          Continue shopping
        </Button>
      </Box>
    )
  }

  let subtotal = 0
  for (const line of cart.products) {
    const prod = lineProduct(line.productId)
    const price = prod?.price ?? 0
    subtotal += price * line.quantity
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Cart
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Paper elevation={0} sx={{ overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Line</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.products.map((line) => {
              const prod = lineProduct(line.productId)
              const name = prod?.name ?? 'Product'
              const price = prod?.price ?? 0
              const lineTotal = price * line.quantity
              const pid =
                typeof line.productId === 'string'
                  ? line.productId
                  : line.productId._id
              return (
                <TableRow key={pid}>
                  <TableCell>
                    {prod ? (
                      <RouterLink to={`/products/${prod._id}`}>{name}</RouterLink>
                    ) : (
                      name
                    )}
                  </TableCell>
                  <TableCell align="right">${price.toFixed(2)}</TableCell>
                  <TableCell align="right">{line.quantity}</TableCell>
                  <TableCell align="right">${lineTotal.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      aria-label="Remove one"
                      onClick={() => removeLine(pid)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Typography variant="h6">Subtotal (items): ${subtotal.toFixed(2)}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={clear} color="warning">
            Clear cart
          </Button>
          <Button component={RouterLink} to="/checkout" variant="contained">
            Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
