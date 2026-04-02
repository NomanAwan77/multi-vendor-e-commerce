export type UserRole = 'admin' | 'vendor' | 'customer'

export interface User {
  _id?: string
  name: string
  email: string
  role: UserRole
  storeName?: string
  storeDescription?: string
}

export interface VendorInfo {
  name?: string
  email?: string
  storeName?: string
  storeDescription?: string
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
  vendorId: string | VendorInfo
}

export interface CartLine {
  productId: Product | string
  quantity: number
}

export interface Cart {
  _id: string
  userId: string
  products: CartLine[]
}

export type PaymentMethod = 'COD' | 'CARD' | 'ONLINE'

export interface ShippingAddress {
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}

export interface OrderProductLine {
  productId: Product | string
  quantity?: number
  price?: number
}

export interface Order {
  _id: string
  userId: string
  products: OrderProductLine[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  paymentStatus?: string
  status?: string
  subTotal?: number
  shippingFee?: number
  tax?: number
  totalAmount: number
  createdAt?: string
  updatedAt?: string
}

export interface VendorOrderView extends Order {
  products: OrderProductLine[]
}
