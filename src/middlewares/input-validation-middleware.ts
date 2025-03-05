import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(401).json({ errors: errors.array() });
    } else {
        next();
    }
}