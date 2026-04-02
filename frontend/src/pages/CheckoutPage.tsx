import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as orderApi from '../api/order.api'
import { ApiError } from '../api/client'
import { checkoutSchema, type CheckoutFormValues } from '../schemas/order.schema'

export function CheckoutPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      paymentMethod: 'COD',
    },
  })

  const onSubmit = async (values: CheckoutFormValues) => {
    setError(null)
    try {
      await orderApi.createOrder({
        shippingAddress: {
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          postalCode: values.postalCode,
        },
        paymentMethod: values.paymentMethod,
      })
      navigate('/orders')
    } catch (e) {
      if (e instanceof ApiError) setError(e.message)
      else setError('Checkout failed')
    }
  }

  return (
    <Paper elevation={0} className="checkout-card" sx={{ p: 3, maxWidth: 560, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Shipping & payment
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Orders use shipping fee and tax calculated on the server.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          margin="normal"
          fullWidth
          label="Street address"
          error={!!errors.address}
          helperText={errors.address?.message}
          {...register('address')}
        />
        <TextField
          margin="normal"
          fullWidth
          label="City"
          error={!!errors.city}
          helperText={errors.city?.message}
          {...register('city')}
        />
        <TextField
          margin="normal"
          fullWidth
          label="State / region"
          error={!!errors.state}
          helperText={errors.state?.message}
          {...register('state')}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Country"
          error={!!errors.country}
          helperText={errors.country?.message}
          {...register('country')}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Postal code"
          error={!!errors.postalCode}
          helperText={errors.postalCode?.message}
          {...register('postalCode')}
        />
        <TextField
          margin="normal"
          fullWidth
          select
          label="Payment method"
          error={!!errors.paymentMethod}
          helperText={errors.paymentMethod?.message}
          {...register('paymentMethod')}
        >
          <MenuItem value="COD">Cash on delivery</MenuItem>
          <MenuItem value="CARD">Card</MenuItem>
          <MenuItem value="ONLINE">Online</MenuItem>
        </TextField>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={isSubmitting}>
          {isSubmitting ? 'Placing order…' : 'Place order'}
        </Button>
      </Box>
    </Paper>
  )
}
