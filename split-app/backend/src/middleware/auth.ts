import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  userId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.header("Authorization");
    console.log('Auth header:', authHeader); // Debug log
    
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      console.log('No token provided'); // Debug log
      res.status(401).json({ message: "No token, authorization denied" });
      return; // Important: return after sending response
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log('Token decoded:', decoded); // Debug log
    
    req.user = { userId: decoded.userId };
    
    // Set userId directly on request for AuthRequest interface
    (req as AuthRequest).userId = decoded.userId;
    
    next(); // Call next() only if everything is successful
  } catch (error) {
    console.error('Auth error:', error); // Debug log
    res.status(401).json({ message: "Token is not valid" });
    return; // Important: return after sending response
  }
};

// Export the same function with different names for compatibility
export const authenticateToken = authMiddleware;