import { Response } from 'express'

/**
 * ResponseUtil class provides utility methods for sending responses and errors.
 */
export class ResponseUtil {
    /**
     * Sends a response with success status, message, data, and optional pagination info.
     * @param res The Express Response object.
     * @param message The message to be included in the response.
     * @param data The data to be included in the response.
     * @param paginationInfo Optional pagination information to be included in the response.
     * @param statusCode Optional status code to be used in the response. Defaults to 200.
     * @returns The Express Response object with the response data.
     */
    static sendResponse<T>(
        res: Response,
        message: string,
        data: T,
        paginationInfo: any = null,
        statusCode = 200
    ): Response<T> {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            paginationInfo,
        })
    }

    /**
     * Sends an error response with failure status, message, and optional error data.
     * @param res The Express Response object.
     * @param message The message to be included in the error response.
     * @param statusCode Optional status code to be used in the error response. Defaults to 500.
     * @param error Optional error data to be included in the error response.
     * @returns The Express Response object with the error data.
     */
    static sendError<T>(res: Response, message: string, statusCode = 500, error?: T): Response<T> {
        return res.status(statusCode).json({
            success: false,
            message,
            error,
        })
    }
}
