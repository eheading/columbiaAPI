/* eslint-disable max-len */
// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import * as yup from 'yup';
import * as bcrypt from 'bcrypt';

import { db } from '../utils/db';
import { createJWT } from '../utils/jwt';
import { logger } from '../utils/logger';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    logger.info({ event });
    // check if the headers are application/json is valid otherwise return 400
    const { headers } = event;
    if (headers['content-type'] !== 'application/json') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid Content-Type header',
        }),
      };
    }

    const body = JSON.parse(event.body ?? '{}');

    // create validation schema using yup this is to validate if we have the right parameters
    const schema = yup.object().shape({
      username: yup.string().required(),
      password: yup.string().min(8).required(), // you can set the minimum length of the password here
    });

    const isValidBody = schema.isValidSync(body);

    // if the body is not valid we return a 400 error i.e if we get bad input we return a bad request response
    if (!isValidBody) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid body',
        }),
      };
    }

    const user = await db.user.findUnique({
      where: {
        username: body.username.toLowerCase(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
        status: true,
        created_at: true,
      },
    });

    logger.info({ user });

    // check if the  password is correct
    logger.info(user && bcrypt.compareSync(body.password, user.password));

    if (!user || bcrypt.compareSync(body.password, user.password) === false) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid credentials',
        }),
      };
    }

    // creat the jwt token with the username and id of the user
    const token = user && createJWT({
      id: user.id,
      username: user.username,
    });

    // remove password field from the user object
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          token,
          user: {
            username: user.username,
            email: user.email,
          },
        },
      }),
    };
  } catch (error) {
    logger.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      }),
    };
  }
};
