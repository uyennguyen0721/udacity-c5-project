import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createAttachmentPresignedUrl } from '../../businessLogic/carts'
import { getUserId } from '../utils'
// import { constants } from 'os'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const cartId = event.pathParameters.cartId
    // TODO: Return a presigned URL to upload a file for a CART item with the provided id
    console.log('cartId', cartId)

    const userId = getUserId(event)


    console.log('userId', userId)
    const url = await createAttachmentPresignedUrl(
      userId,
      cartId
    )

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadurl: url
      })
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
