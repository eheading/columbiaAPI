/* eslint-disable import/no-extraneous-dependencies */
import * as sst from '@serverless-stack/resources';
import { CorsHttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from '@aws-cdk/aws-apigatewayv2-authorizers';
import { ApiAuthorizationType } from '@serverless-stack/resources';

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const lambdas = {
      signup: new sst.Function(this, 'signupLambda', {
        functionName: scope.logicalPrefixedName('signup'),
        handler: 'src/signup/index.handler',

      }),
      login: new sst.Function(this, 'loginLambda', {
        functionName: scope.logicalPrefixedName('login'),
        handler: 'src/login/index.handler',

      }),
      authorizer: new sst.Function(this, 'authorizerLambda', {
        functionName: scope.logicalPrefixedName('authorizer'),
        handler: 'src/authorizer/index.handler',

      }),
    };

    const api = new sst.Api(this, 'Api', {
      cors: {
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST, CorsHttpMethod.OPTIONS],
      },
      defaultAuthorizationType: ApiAuthorizationType.CUSTOM,
      defaultAuthorizer: new HttpLambdaAuthorizer({
        authorizerName: 'LambdaAuthorizer',
        handler: lambdas.authorizer,
        responseTypes: [HttpLambdaResponseType.IAM],
      }),
      routes: {
        'POST /signup': {
          function: lambdas.signup,
          authorizationType: ApiAuthorizationType.NONE,
        },
        'POST /login': {
          function: lambdas.login,
          authorizationType: ApiAuthorizationType.NONE,
        },
        'GET /': 'src/lambda.handler',
      },
    });

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
