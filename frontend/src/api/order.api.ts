import { apiFetch } from './client'
import { API } from './endpoints'
import type { Order, PaymentMethod, ShippingAddress } from '../types/models'

export interface CreateOrderBody {
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
}

export async function createOrder(body: CreateOrderBody) {
  return apiFetch<{ message: string; order: Order }>(API.order.create, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getMyOrders() {
  return apiFetch<{ message: string; orders: Order[] }>(API.order.myOrders, {
    method: 'GET',
  })
}

export async function getVendorOrders() {
  return apiFetch<{
    message: string
    vendorOrders: Order[]
  }>(API.order.vendorOrders, { method: 'GET' })
}
