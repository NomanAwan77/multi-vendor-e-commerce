import * as yup from 'yup'

export const productFormSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Must be positive')
    .required('Price is required'),
  stock: yup
    .number()
    .integer('Must be a whole number')
    .min(0, 'Cannot be negative')
    .required('Stock is required'),
  category: yup.string().required('Category is required'),
})

export type ProductFormValues = yup.InferType<typeof productFormSchema>
