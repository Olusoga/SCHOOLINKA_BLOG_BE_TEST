import { Response, Request, NextFunction } from 'express';

export const mockRequest = (body: unknown, headers = {}): Request => {
    const req = {
        body,
        headers
    } as Request;
    return req;
};

export const mockResponse = (): Response => {
    const res = {} as Response;
    res.sendStatus = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

export const mockNext = (): NextFunction => {
    return jest.fn();
};
