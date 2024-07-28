// src/middlewares/error-handler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHundler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message}); // Ensure this line is correct
};



interface CustomError extends Error {
  status?: number;
}

export function notFoundError(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const err: CustomError = new Error("Not Found");
  err.status = 404;
  next(err); // Pass error to the next middleware
}

// export function errorHundler(
//   err: CustomError,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void {
//   res.status(err.status || 500).json({
//     message: err.message,
//   });
// }
