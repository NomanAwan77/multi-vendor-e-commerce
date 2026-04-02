import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormLabel,
  Link,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { registerSchema, type RegisterFormValues } from '../schemas/auth.schema'
import { ApiError } from '../api/client'

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'customer',
      storeName: '',
      storeDescription: '',
    },
  })

  const role = watch('role')

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null)
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        ...(values.role === 'vendor'
          ? {
              storeName: values.storeName,
              storeDescription: values.storeDescription || undefined,
            }
          : {}),
      })
      navigate('/products')
    } catch (e) {
      if (e instanceof ApiError) setError(e.message)
      else setError('Something went wrong')
    }
  }

  return (
    <Paper elevation={0} className="auth-card" sx={{ p: 4, maxWidth: 440, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create an account
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
          label="Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password')}
        />
        <FormControl fullWidth margin="normal">
          <FormLabel>I am registering as</FormLabel>
          <TextField select {...register('role')} value={role}>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="vendor">Vendor</MenuItem>
          </TextField>
        </FormControl>
        {role === 'vendor' && (
          <>
            <TextField
              margin="normal"
              fullWidth
              label="Store name"
              error={!!errors.storeName}
              helperText={errors.storeName?.message}
              {...register('storeName')}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Store description"
              multiline
              minRows={2}
              {...register('storeDescription')}
            />
          </>
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Register'}
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">
          Log in
        </Link>
      </Typography>
    </Paper>
  )
}
