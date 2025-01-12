import { Response } from 'express';

enum SuccessResponseStatus {
    OK = 200
}

abstract class ApiResponse {
    status: number;

    constructor(status: number) {
        this.status = status;
    }

    public send(res: Response, data: unknown) {
        res.status(this.status).json(data);
    }
}

export class SuccessResponse extends ApiResponse {
    constructor() {
        super(SuccessResponseStatus.OK);
    }

    public send(res: Response, data: any) {
        res.status(this.status).json({ success: true, data });
    }
}

export class ErrorResponse extends ApiResponse {
    static send(api: ApiResponse, ress: Response, error: Error) {
        ress.status(api.status).json({ success: false, error: error.message });
    }
}