/* eslint-disable no-new */
import * as sst from '@serverless-stack/resources';
import MyStack from './MyStack';

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
    environment: {
      JWT_AUDIENCE: process.env.JWT_AUDIENCE as string,
      JWT_ISSUER: process.env.JWT_ISSUER as string,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
      JWT_SECRET: process.env.JWT_SECRET as string,
    },
  });

  new MyStack(app, 'my-stack');

  // Add more stacks
}
