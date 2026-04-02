import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as productApi from '../api/product.api'
import * as cartApi from '../api/cart.api'
import { ApiError } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import type { Product } from '../types/models'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [cartMsg, setCartMsg] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await productApi.getProductById(id)
        if (!cancelled) {
          setProduct(res.product)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError) {
            setError(e.status === 401 ? 'UNAUTHORIZED' : e.message)
          } else setError('Failed to load product')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleAddToCart = async () => {
    if (!user || !id) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } })
      return
    }
    setCartMsg(null)
    setAdding(true)
    try {
      await cartApi.addToCart(id, qty)
      setCartMsg('Added to cart')
    } catch (e) {
      if (e instanceof ApiError) setCartMsg(e.message)
      else setCartMsg('Could not add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !product) {
    const is401 = error === 'UNAUTHORIZED'
    return (
      <Box>
        <Typography color="error" role="alert" sx={{ mb: is401 ? 2 : 0 }}>
          {is401 ? 'You must be logged in to view this product.' : (error ?? 'Product not found')}
        </Typography>
        {is401 && (
          <Button component={RouterLink} to="/login" variant="contained">
            Log in
          </Button>
        )}
      </Box>
    )
  }

  const vendor =
    typeof product.vendorId === 'object' && product.vendorId !== null
      ? product.vendorId
      : null

  return (
    <Card className="product-detail" elevation={0} sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <CardMedia
        component="img"
        sx={{ width: { xs: '100%', md: 400 }, objectFit: 'cover', maxHeight: 400 }}
        image={product.imageUrl || '/vite.svg'}
        alt={product.name}
      />
      <Box sx={{ p: 3, flex: 1, minWidth: 280 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {product.category}
        </Typography>
        <Typography variant="h5" sx={{ my: 2 }} fontWeight={700}>
          ${product.price.toFixed(2)}
        </Typography>
        <Typography variant="body1" paragraph>
          {product.description}
        </Typography>
        {vendor && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sold by: {vendor.storeName ?? vendor.name ?? 'Vendor'}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mb: 2 }}>
          In stock: {product.stock}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            type="number"
            label="Quantity"
            size="small"
            inputProps={{ min: 1, max: product.stock }}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            sx={{ width: 120 }}
          />
          <Button variant="contained" onClick={handleAddToCart} disabled={adding || product.stock < 1}>
            {adding ? 'Adding…' : 'Add to cart'}
          </Button>
        </Box>
        {cartMsg && (
          <Typography variant="body2" sx={{ mt: 2 }} color={cartMsg.startsWith('Added') ? 'success.main' : 'error'}>
            {cartMsg}
          </Typography>
        )}
      </Box>
    </Card>
  )
}
