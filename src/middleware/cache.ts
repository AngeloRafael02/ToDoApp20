import { NextFunction, Request, RequestHandler, Response } from 'express';
import NodeCache from 'node-cache';

const myCache = new NodeCache({ stdTTL: 600 });

export const cacheMiddleware = (duration: number = 1800): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.originalUrl || req.url;
        const cachedResponse = myCache.get(key);

        if (cachedResponse) {
            res.send(cachedResponse);
            return;
        }

        const originalSend = res.send;
        res.send = (body: any): Response => {
            if (res.statusCode === 200) {
                myCache.set(key, body, duration);
            }
            return originalSend.call(res, body);
        };

        next();
    };
};