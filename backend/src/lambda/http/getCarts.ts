import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getCartsForUser as getCartsForUser } from '../../businessLogic/carts'
import { getUserId } from '../utils';

// TODO: Get all CART items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const carts = await getCartsForUser(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: carts
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
