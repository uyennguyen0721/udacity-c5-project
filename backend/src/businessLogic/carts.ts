import { CartsAccess } from '../dataLayer/cartsAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { CartItem } from '../models/CartItem'
import { CreateCartRequest } from '../requests/CreateCartRequest'
import { UpdateCartRequest } from '../requests/UpdateCartRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
//import { loggers } from 'winston';

// TODO: Implement businessLogic

const log = createLogger('CartsAccess')
const attachmentUtils = new AttachmentUtils()
const cartsAccess = new CartsAccess()

//get carts funciton

export async function getCartsForUser(
    userId: string
): Promise<CartItem[]> {
    log.info('Get carts for user')
    return cartsAccess.getAllCarts(userId)
}

//create cart
export async function createCart(
    newCart: CreateCartRequest,
    userId: string
): Promise<CartItem> {
    log.info("Function Create CART")

    const cartId = uuid.v4()
    const createdAt = new Date().toISOString()
    // const s3AttachmenUrl = attachmentUtils.getAttachmentUrl(cartId)
    const newItem: CartItem = {
        userId,
        cartId,
        createdAt,
        done: false,
        attachmentUrl: null,
        ...newCart
    }

    return await cartsAccess.createCartItem(newItem)
}

// update cart
export async function updateCart(
    userId: string,
    cartId: string,
    cartUpdate: UpdateCartRequest
) {
    log.info('update cart for user')
    await cartsAccess.updateCart(userId, cartId, cartUpdate)
}

// delete cart

export async function deleteCart(
    userId: string,
    cartId: string,
): Promise<string> {
    log.info('delete cart')
    return cartsAccess.deleteCart(userId, cartId)
}

//create attachment 

export async function createAttachmentPresignedUrl(
    userId: string,
    cartId: string,
): Promise<string> {
    log.info('create attachment', userId, cartId)
    return attachmentUtils.getUploadUrl(cartId)
}

export async function updateImage(
    userId: string,
    cartId: string,
    attachmentUrl: string
) {
    log.info('create attachment', userId, cartId)
    await cartsAccess.updateCartAttachmentUrl(userId, cartId, attachmentUrl)
}
