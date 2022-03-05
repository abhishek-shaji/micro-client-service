import middy from '@middy/core';
import axios from 'axios';
import { ForbiddenException } from 'middy-exception-handler';
import { APIGatewayEvent, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const validateRecaptcha = (
  action?: string
): middy.MiddlewareObj<APIGatewayEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
    handler
  ): Promise<void> => {
    try {
      const token: string = handler.event.headers['x-recaptcha-token'];
      const VERIFICATION_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTHA_PRIVATE_KEY}&response=${token}`;

      const response = await axios.post(VERIFICATION_URL);
      const { success, score } = response.data;

      console.log(response.data, 'validation data', process.env.RECAPTHA_PRIVATE_KEY, token);

      if (!success || score < 0.5) {
        throw new ForbiddenException('Recaptcha Validation Failed');
      }

      if (action && response.data && action !== response.data.action) {
        throw new ForbiddenException('Recaptcha Validation Failed');
      }
    } catch (e) {
      throw new ForbiddenException('Recaptcha Validation Failed');
    }
  };

  return {
    before,
  };
};
