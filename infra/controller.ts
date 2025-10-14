import { InternalServerError, MethodNotAllowedError } from "infra/errors";
import { NextApiRequest, NextApiResponse } from "next";

function onNoMatchHandler(_: NextApiRequest, response: NextApiResponse): void {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(
  error: unknown,
  _: NextApiRequest,
  response: NextApiResponse,
): void {
  const publicErrorObject = new InternalServerError({
    statusCode: (error as any).statusCode,
    cause: error,
  });

  console.error(publicErrorObject);

  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
