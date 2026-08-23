import { Response } from 'express';
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
    };
    timestamp: string;
}
export declare const sendSuccess: <T>(res: Response, data: T, statusCode?: number, message?: string) => void;
export declare const sendError: (res: Response, message: string, statusCode?: number, code?: string) => void;
export declare class ApiError extends Error {
    message: string;
    statusCode: number;
    code?: string | undefined;
    constructor(message: string, statusCode?: number, code?: string | undefined);
}
//# sourceMappingURL=response.d.ts.map