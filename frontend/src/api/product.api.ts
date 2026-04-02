import { apiFetch } from './client'
import { API } from './endpoints'
import type { Product } from '../types/models'

export async function getAllProducts() {
  return apiFetch<{ message: string; products: Product[] }>(API.product.list, {
    method: 'GET',
  })
}

export async function getProductById(id: string) {
  return apiFetch<{ message: string; product: Product }>(API.product.byId(id), {
    method: 'GET',
  })
}

export async function createProduct(formData: FormData) {
  return apiFetch<{ message: string; product: Product }>(API.product.create, {
    method: 'POST',
    body: formData,
  })
}

export async function updateProduct(id: string, formData: FormData) {
  return apiFetch<{ message: string; product: Product }>(
    API.product.update(id),
    {
      method: 'PUT',
      body: formData,
    },
  )
}

export async function deleteProduct(id: string) {
  return apiFetch<{ message: string }>(API.product.delete(id), {
    method: 'DELETE',
  })
}
