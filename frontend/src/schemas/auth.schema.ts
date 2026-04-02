import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>

export interface RegisterFormValues {
  name: string
  email: string
  password: string
  role: 'customer' | 'vendor'
  storeName?: string
  storeDescription?: string
}

export const registerSchema = yup
  .object({
    name: yup.string().required('Name is required').min(2),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required').min(6, 'At least 6 characters'),
    role: yup.mixed<'customer' | 'vendor'>().oneOf(['customer', 'vendor']).required(),
    storeName: yup.string().when('role', {
      is: 'vendor',
      then: (schema) => schema.required('Store name is required for vendors'),
      otherwise: (schema) => schema.optional(),
    }),
    storeDescription: yup.string().optional(),
  })
  .required() as yup.ObjectSchema<RegisterFormValues>
