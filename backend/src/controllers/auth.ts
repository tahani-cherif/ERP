import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";
import userModel from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// Define a type for the decoded JWT payload
interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

// @desc    signup
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req: Request, res: Response) => {
  const user = await userModel.create(req.body);
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.status(201).json({ data: user, token });
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  user.password = undefined; // Remove password from response
  res.status(200).json({ data: user, token });
});

// @desc    Forget password
// @route   POST /api/auth/forgetpassword
// @access  Public
const forgetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  await userModel.findByIdAndUpdate(user._id, { tokenPassword: token });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailConfigs = {
    from: process.env.EMAIL_USER,
    to: req.body.email,
    subject: "Reset Password",
    html: `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          /* CSS styles omitted for brevity */
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="http://localhost:8080/image/logo.png" alt="Your Company Logo">
          </div>
          <div class="content">
            <h1>Reset Your Password</h1>
            <p>Hello,</p>
            <p>We received a request to reset your password. Please click the button below to reset your password:</p>
            <a href="http://localhost:4200/#/forgetpassword/${token}">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,</p>
            <p>Tunisie insider</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Tunisie insider. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailConfigs, (error:any, info:any) => {
    if (error) {
      return next(new ApiError(error.message, 500));
    }
    res.status(200).json({ success: true, data: "Email sent" });
  });
});

// @desc    Update password
// @route   POST /api/auth/updatepassword
// @access  Public
const updatePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userModel.findOne({ tokenPassword: req.body.token });
  if (!user) {
    return next(new ApiError("Invalid token", 400));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  await userModel.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    tokenPassword: "",
  });

  res.status(200).json({ success: true, data: "Password updated" });
});

// @desc    Ensure the user is authenticated
const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("You are not logged in! Please log in to get access.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    const currentUser:any = await userModel.findById(decoded.userId);
    if (!currentUser) {
      return next(new ApiError("The user belonging to this token does no longer exist.", 401));
    }

    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp = parseInt((currentUser.passwordChangedAt.getTime() / 1000).toString(), 10);
      if (decoded.iat < passChangedTimestamp) {
        return next(new ApiError("User recently changed password! Please log in again.", 401));
      }
    }
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new ApiError("Invalid token. Please log in again.", 401));
  }
});

// @desc    Restrict access to specific roles
const allowedTo = (...roles: string[]) => (req: any, res: Response, next: NextFunction) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError("You do not have permission to perform this action", 403));
  }
  next();
};

// // @desc    Approve account
// const approvedAccount = asyncHandler(async (req: Request, res: Response) => {
//   const { token } = req.params;
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
//     const user = await userModel.findById(decoded.userId);
//     if (!user) {
//       return res.status(400).send("Invalid token");
//     }
//     await userModel.findByIdAndUpdate(user._id, { status: true });

//     res.send("Email verified successfully");
//   } catch (error) {
//     res.status(500).send("Error verifying email");
//   }
// });

export {
  signup,
  login,
  allowedTo,
  protect,
  forgetPassword,
  updatePassword,
  // approvedAccount,
};
