export interface CartItem {
  userId: string
  cartId: string
  createdAt: string
  name: string
  description: string
  price: string
  done: boolean
  attachmentUrl?: string
}
