import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { logger } from './utils/logger';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  logger.info({ event });
  return ({
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, World! Your request was received at ${event.requestContext.time}.`,
  });
};
