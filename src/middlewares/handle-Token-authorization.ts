import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ErrorCodes } from 'src/domain/errors';
import { JWT_TOKEN_SECRET } from 'src/configs/app';

class AuthMiddleware {
    public static async protect(req: any, res: Response, next: NextFunction) {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            return res.status(401).json({
                error: 'Token is missing or invalid',
                statusCode: 401
            });
        }

        const token = accessToken.replace('Bearer ', '');
        try {
            const decoded = await jwt.verify(token, JWT_TOKEN_SECRET);
            req.User = decoded;
            return next();
        } catch (err) {
            res.status(403).json({
                error_code: ErrorCodes.UNAUTHORIZED_REQUEST,
                message: 'You are not authorize to access this route'
            });
        }
    }
}
export default AuthMiddleware;