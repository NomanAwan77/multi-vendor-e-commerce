import { apiFetch } from './client'
import { API } from './endpoints'
import type { Cart } from '../types/models'

export async function addToCart(productId: string, quantity = 1) {
  return apiFetch<{ message: string; cart: Cart }>(API.cart.add, {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  })
}

export async function getCart() {
  return apiFetch<{ message: string; cart: Cart }>(API.cart.get, {
    method: 'GET',
  })
}

export async function removeFromCart(productId: string) {
  return apiFetch<{ message: string; cart: Cart }>(
    API.cart.removeLine(productId),
    { method: 'DELETE' },
  )
}

export async function clearCart() {
  return apiFetch<{ message: string; cart: Cart }>(API.cart.clear, {
    method: 'DELETE',
  })
}
