import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // @desc Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validatorMiddleware;
