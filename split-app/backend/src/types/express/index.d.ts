import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // ✅ Add userId to the Request object
    }
  }
}

export {};
