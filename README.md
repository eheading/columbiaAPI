# Getting Started with Serverless Stack (SST)

This project was bootstrapped with [Create Serverless Stack](https://docs.serverless-stack.com/packages/create-serverless-stack).

Start by installing the dependencies.

```bash
$ npm install
```

## Commands

### `npm run start`

Starts the local Lambda development environment.

### `npm run build`

Build your app and synthesize your stacks.

Generates a `.build/` directory with the compiled files and a `.build/cdk.out/` directory with the synthesized CloudFormation stacks.

### `npm run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy a specific stack.

### `npm run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally remove a specific stack.

### `npm run test`

Runs your tests using Jest. Takes all the [Jest CLI options](https://jestjs.io/docs/en/cli).

## Documentation

Learn more about the Serverless Stack.

- [Docs](https://docs.serverless-stack.com)
- [@serverless-stack/cli](https://docs.serverless-stack.com/packages/cli)
- [@serverless-stack/resources](https://docs.serverless-stack.com/packages/resources)

## Community

[Follow us on Twitter](https://twitter.com/ServerlessStack) or [post on our forums](https://discourse.serverless-stack.com).

200 LOGIN RESPONSE

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJiYXJha2NvZGVzIiwiaWF0IjoxNjM5MDY1MDM4LCJleHAiOjE2MzkwNjg2MzgsImF1ZCI6Im15c2VyY2llLmNvbSIsImlzcyI6Imh0dHBzOi8vbXlkb21haW4uY29tIn0.D01BmuMRLRFxVoL2Tedd4zEXyQVYbITyb6xIPOSHBhs",
    "user": {
      "id": 2,
      "username": "barakcodes",
      "email": "barakcodes@email.com"
    }
  }
}
```

## Using the token

The token should be placed inside the header for all of your requests as:

```json
{
  "Authorization": "Bearer TOKEN_VALUE"
}
```

If the token is not valid or you do not include the header, you will receive a 401 Unauthorized response.
If the token is malformed or expired you will receive a 403 Forbidden response.

## Deployment

##### Pre-deployment

1. Add your environment variables to your `.env` file.

```bash
DATABASE_URL: <PRISMA_DATA_PROXY_URL>,
JWT_AUDIENCE: <YOUR_CLIENT_APP_URL>,
JWT_ISSUER: <YOUR_SERVER_URL>,
JWT_EXPIRES_IN: <TIME IN d,s,m>, eg. 3d, 24h, 60m
JWT_SECRET: <SECRET-STRING>

```

This is how you would deploy your project to AWS.

1. CD to the root of your project. For example, if you are in the `/my-project` directory, run `cd my-project`.
2. Install the dependencies using yarn or npm

```bash
$ npm install
OR
$ yarn install
```

3. Run the deployment command.

```bash
 $ yarn deploy --stage <YOUR-STAGE> --region <YOUR-REGION>
```

For Hong Kong region is `ap-east-1`

_NOTE:_ If you have multiple AWS accounts, you can change the deploy script in the `package.json` to use your profile like so.

```json
AWS_PROFILE=my-profile npx sst deploy
```

And then you can use the `AWS_PROFILE` environment variable to specify which profile to use.

After this the deployment should be all green ✅
"# columbiaAPI" 
