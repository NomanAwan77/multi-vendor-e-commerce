/**
 * Backend route prefixes (mounted under VITE_API_BASE_URL).
 * Matches backend/src/app.js
 */
export const API = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    getAllUsers: '/auth/getAllUsers',
  },
  product: {
    create: '/product/createProduct',
    list: '/product/getAllProducts',
    byId: (id: string) => `/product/getProductById/${id}`,
    update: (id: string) => `/product/updateProduct/${id}`,
    delete: (id: string) => `/product/deleteProduct/${id}`,
  },
  cart: {
    add: '/cart/addToCart',
    get: '/cart/getCart',
    removeLine: (productId: string) => `/cart/deleteFromCart/${productId}`,
    clear: '/cart/clearCart',
  },
  order: {
    create: '/order/create',
    myOrders: '/order/getOrders',
    vendorOrders: '/order/getOrdersByVendor',
  },
} as const
