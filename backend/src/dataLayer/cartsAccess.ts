import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { CartItem } from '../models/CartItem'
import { CartUpdate } from '../models/CartUpdate';
var AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class CartsAccess {
    constructor(

        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly cartsTable = process.env.CARTS_TABLE,
        private readonly cartsCreatedAtIndex = process.env.INDEX_NAME
    ) { }

    async getAllCarts(userId: string): Promise<CartItem[]> {
        if (userId) {
            logger.info("Ready to get all todos");

            const carts = await this.docClient.query({
                TableName: this.cartsTable,
                IndexName: this.cartsCreatedAtIndex,
                KeyConditionExpression: "#userId = :userId",
                ExpressionAttributeNames: {
                    "#userId": "userId"
                },
                ExpressionAttributeValues: {
                    ":userId": userId
                }
            }).promise();

            logger.info(`Query successfully ${carts.Items}`);

            return carts.Items as CartItem[];
        } else {
            logger.error(`Unauthenticated operation`);
        }
    }

    async createCartItem(cart: CartItem): Promise<CartItem> {
        logger.info("Ready to add a new cart")

        const result = await this.docClient.put({
            TableName: this.cartsTable,
            Item: cart
        }).promise();

        logger.info('cart created', result);

        return cart as CartItem;
    }

    public async updateCart(userId: string, cartId: string, cart: CartUpdate) {
        if (userId) {
            logger.info(`Found cart ${cartId}, ready for update`);

            await this.docClient.update({
                TableName: this.cartsTable,
                Key: {
                    cartId,
                    userId
                },
                UpdateExpression: "set #name = :name, #price = :price, #done = :done",
                ExpressionAttributeNames: {
                    "#name": "name",
                    "#price": "price",
                    "#done": "done"
                },
                ExpressionAttributeValues: {
                    ":name": cart.name,
                    ":price": cart.price,
                    ":done": cart.done
                }
            }).promise();

            logger.info("Updated successfull ", cart)
        } else {
            logger.error(`Unauthenticated operation`);
        }
    }

    async deleteCart(userId: string, cartId: string): Promise<string> {
        if (userId) {
            logger.info(`Ready to delete todo ${cartId}`);

            const result = await this.docClient.delete({
                TableName: this.cartsTable,
                Key: {
                    cartId,
                    userId
                }
            }).promise();

            logger.info("Delete successful", result);

            return cartId as string

        } else {
            logger.error("Unauthenticated operation");
        }
    }

    async updateCartAttachmentUrl(
        userId: string,
        cartId: string,
        attachmentUrl: string

    ): Promise<void> {
        logger.info("Update cart attachment url")

        await this.docClient
            .update({
                TableName: this.cartsTable,
                Key: {
                    cartId,
                    userId
                },
                UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
                ExpressionAttributeNames: {
                    "#attachmentUrl": "attachmentUrl"
                },
                ExpressionAttributeValues: {
                    ':attachmentUrl': attachmentUrl
                }
            })
            .promise()

    }
}