import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import * as productApi from '../api/product.api'
import { ApiError } from '../api/client'
import type { Product } from '../types/models'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await productApi.getAllProducts()
        if (!cancelled) {
          setProducts(res.products)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError) {
            setError(
              e.status === 401
                ? 'You must be logged in to browse products.'
                : e.message,
            )
          } else setError('Failed to load products')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Typography color="error" role="alert" sx={{ mb: error.includes('logged in') ? 2 : 0 }}>
          {error}
        </Typography>
        {error.includes('logged in') && (
          <Button component={RouterLink} to="/login" variant="contained">
            Log in
          </Button>
        )}
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        All products
      </Typography>
      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid key={p._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card className="product-card" elevation={2}>
              <CardActionArea component={RouterLink} to={`/products/${p._id}`}>
                <CardMedia
                  component="img"
                  height="180"
                  image={p.imageUrl || '/vite.svg'}
                  alt={p.name}
                  sx={{ objectFit: 'cover', bgcolor: 'grey.100' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h2" noWrap>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {p.category}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }} fontWeight={600}>
                    ${p.price.toFixed(2)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {products.length === 0 && (
        <Typography color="text.secondary">No products yet.</Typography>
      )}
    </Box>
  )
}
