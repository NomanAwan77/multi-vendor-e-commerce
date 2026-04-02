import * as yup from 'yup'

export const checkoutSchema = yup.object({
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State / region is required'),
  country: yup.string().required('Country is required'),
  postalCode: yup.string().required('Postal code is required'),
  paymentMethod: yup
    .mixed<'COD' | 'CARD' | 'ONLINE'>()
    .oneOf(['COD', 'CARD', 'ONLINE'])
    .required(),
})

export type CheckoutFormValues = yup.InferType<typeof checkoutSchema>
