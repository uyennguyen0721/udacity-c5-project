import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateCartRequest } from '../../requests/CreateCartRequest'
import { getUserId } from '../utils';
import { createCart } from '../../businessLogic/carts'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newCart: CreateCartRequest = JSON.parse(event.body)
    // TODO: Implement creating a new CART item
    const userId = getUserId(event)

    const newItem = await createCart(newCart, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
