import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as productApi from '../../api/product.api'
import { ApiError } from '../../api/client'
import { productFormSchema, type ProductFormValues } from '../../schemas/product.schema'

interface Props {
  mode: 'create' | 'edit'
}

export function VendorProductFormPage({ mode }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
    },
  })

  useEffect(() => {
    if (mode !== 'edit' || !id) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await productApi.getProductById(id)
        if (cancelled) return
        reset({
          name: res.product.name,
          description: res.product.description,
          price: res.product.price,
          stock: res.product.stock,
          category: res.product.category,
        })
        setLoadError(null)
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError) setLoadError(e.message)
          else setLoadError('Failed to load product')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [mode, id, reset])

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitError(null)
    if (mode === 'create' && !imageFile) {
      setSubmitError('Please choose a product image')
      return
    }
    const fd = new FormData()
    fd.append('name', values.name)
    fd.append('description', values.description)
    fd.append('price', String(values.price))
    fd.append('stock', String(values.stock))
    fd.append('category', values.category)
    if (imageFile) fd.append('image', imageFile)

    try {
      if (mode === 'create') {
        await productApi.createProduct(fd)
        navigate('/products')
      } else if (id) {
        await productApi.updateProduct(id, fd)
        navigate(`/products/${id}`)
      }
    } catch (e) {
      if (e instanceof ApiError) setSubmitError(e.message)
      else setSubmitError('Save failed')
    }
  }

  const handleDelete = async () => {
    if (mode !== 'edit' || !id) return
    if (!window.confirm('Delete this product permanently?')) return
    try {
      await productApi.deleteProduct(id)
      navigate('/products')
    } catch (e) {
      if (e instanceof ApiError) setSubmitError(e.message)
      else setSubmitError('Delete failed')
    }
  }

  if (loadError) {
    return (
      <Typography color="error" role="alert">
        {loadError}
      </Typography>
    )
  }

  return (
    <Paper elevation={0} sx={{ p: 3, maxWidth: 560, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {mode === 'create' ? 'New product' : 'Edit product'}
      </Typography>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          margin="normal"
          fullWidth
          label="Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Description"
          multiline
          minRows={3}
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register('description')}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Price"
          type="number"
          inputProps={{ step: '0.01' }}
          error={!!errors.price}
          helperText={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Stock"
          type="number"
          error={!!errors.stock}
          helperText={errors.stock?.message}
          {...register('stock', { valueAsNumber: true })}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Category"
          error={!!errors.category}
          helperText={errors.category?.message}
          {...register('category')}
        />
        <Button variant="outlined" component="label" sx={{ mt: 2, display: 'block' }}>
          {mode === 'create' ? 'Upload image *' : 'Replace image (optional)'}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </Button>
        {imageFile && (
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Selected: {imageFile.name}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
          {mode === 'edit' && (
            <Button type="button" color="error" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  )
}
