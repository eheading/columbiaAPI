import * as jwt from 'jsonwebtoken';

interface User {
    id: number
    username: string
 }

// create a JWT with all the right claims
// and return the token
export const createJWT = (user: User) => jwt.sign(user, process.env.JWT_SECRET as string, {
  subject: user.username,
  algorithm: 'HS256',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  audience: process.env.JWT_AUDIENCE as string,
  issuer: process.env.JWT_ISSUER, // use company name or service name to get
});

// verify the token
export const verifyJWT = (token: string) => jwt.verify(token, process.env.JWT_SECRET as string, {
  audience: process.env.JWT_AUDIENCE as string,
  issuer: process.env.JWT_ISSUER,
  algorithms: ['HS256'],
});
