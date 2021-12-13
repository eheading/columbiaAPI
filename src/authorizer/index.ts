import { CustomAuthorizerResult } from 'aws-lambda';
import { JwtPayload } from 'jsonwebtoken';
import { verifyJWT } from '../utils/jwt';
import { logger } from '../utils/logger';

const generatePolicy = (principalId: string, effect: string, resource: string) => {
  const authResponse = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };

  return authResponse;
};

export const handler = async (event: any): Promise<CustomAuthorizerResult> => {
  try {
    logger.info(event.methodArn);
    const { authorization } = event.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return generatePolicy('user' as string, 'Deny', event.methodArn);
    }

    logger.info('here');
    const payload = verifyJWT(authorization.split(' ')[1].trim()) as JwtPayload;

    logger.info({ payload });
    if (!payload) {
      return generatePolicy('user' as string, 'Deny', event.methodArn);
    }

    return generatePolicy(payload.sub as string, 'Allow', event.methodArn);
  } catch (error) {
    logger.error(error);
    return generatePolicy('user' as string, 'Deny', event.methodArn);
  }
};
