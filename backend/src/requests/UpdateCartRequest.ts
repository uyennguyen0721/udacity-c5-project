/**
 * Fields in a request to update a single CART item.
 */
export interface UpdateCartRequest {
  name: string
  description: string
  price: string
  done: boolean
}