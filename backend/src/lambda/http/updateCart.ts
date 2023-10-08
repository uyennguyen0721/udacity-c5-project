import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateCart } from '../../businessLogic/carts'
import { UpdateCartRequest } from '../../requests/UpdateCartRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const cartId = event.pathParameters.cartId
    const updatedCart: UpdateCartRequest = JSON.parse(event.body)
    // TODO: Update a CART item with the provided id using values in the "updatedCart" object

    const userId = getUserId(event)

    await updateCart(
      userId,
      cartId,
      updatedCart
    )

    return {
      statusCode: 204,
      body: JSON.stringify({})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
