import { Response } from 'express';
import { ErrorResponse } from '../core/response';

enum ErrorResponseStatus {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 400,
    INTERNAL_ERROR = 500,
}

export class ApiError extends Error {
    status: ErrorResponseStatus;
  
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }

    static request(err: ApiError, res: Response) {
        return new ErrorResponse(err.status).send(res, err);
        // return res.status(err.status).json({ success: false, error: err.message });
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad Request') {
        super(ErrorResponseStatus.BAD_REQUEST, message);
    }
}

export class ServerError extends ApiError {
    constructor(message: string = 'Internal Error') {
        super(ErrorResponseStatus.INTERNAL_ERROR, message);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = 'Unauthorized') {
        super(ErrorResponseStatus.UNAUTHORIZED, message);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = 'Not Found') {
        super(ErrorResponseStatus.NOT_FOUND, message);
    }
}