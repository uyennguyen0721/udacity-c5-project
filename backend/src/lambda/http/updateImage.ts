import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateImage } from '../../businessLogic/carts'
import { getUserId } from '../utils'
import { AttachmentUtils } from '../../helpers/attachmentUtils'

const attachment = new AttachmentUtils()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const cartId = event.pathParameters.cartId
    // TODO: Update a CART item with the provided id using values in the "updatedCart" object

    const userId = getUserId(event)

    const attachmentUrl: string = attachment.getAttachmentUrl(cartId)

    await updateImage(
      userId,
      cartId,
      attachmentUrl
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
