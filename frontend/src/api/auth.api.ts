import { apiFetch } from './client'
import { API } from './endpoints'
import type { User } from '../types/models'

export interface LoginBody {
  email: string
  password: string
}

export interface RegisterBody {
  name: string
  email: string
  password: string
  role?: 'admin' | 'vendor' | 'customer'
  storeName?: string
  storeDescription?: string
}

export async function login(body: LoginBody) {
  return apiFetch<{ message: string; user: User }>(API.auth.login, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function register(body: RegisterBody) {
  return apiFetch<{ message: string; user: User }>(API.auth.register, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function logout() {
  return apiFetch<{ message: string }>(API.auth.logout, { method: 'GET' })
}

export async function getAllUsers() {
  return apiFetch<{ message: string; users: User[] }>(API.auth.getAllUsers, {
    method: 'GET',
  })
}
