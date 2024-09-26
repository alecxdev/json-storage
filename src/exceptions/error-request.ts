import { Response } from 'express';

enum ResponseStatus {
    BAD_REQUEST = 400,
    INTERNAL_ERROR = 500,
}

export class ApiError extends Error {
    status: ResponseStatus;
  
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }

    static request(err: ApiError, res: Response) {
        return res.status(err.status).json({ error: err.message });
    }
}
  
export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad Request') {
        super(ResponseStatus.BAD_REQUEST, message);
    }
}

export class ServerError extends ApiError {
    constructor(message: string = 'Internal Error') {
        super(ResponseStatus.INTERNAL_ERROR, message);
    }
}