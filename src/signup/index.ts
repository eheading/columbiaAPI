/* eslint-disable max-len */
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
      email: yup.string().email(),
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

    // here we'll has the password using bcrypt with a secret key and then we'll create the user
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const isUserExists = await db.user.findUnique({
      where: { username: body.username.toLowerCase() },
    });

    if (isUserExists) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          statusCode: 400,
          error: 'Bad Request',
          message: 'User already exists',
        }),
      };
    }

    const user = await db.user.create({
      data: {
        username: body.username.toLowerCase(),
        email: body.email?.toLowerCase(),
        password: hashedPassword,
        created_at: new Date().toUTCString(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
      },
    });

    // creat the jwt token with the username and id of the user with all the config as per JWT spec
    const token = createJWT({
      id: user.id,
      username: user.username,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          token,
          user,
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
