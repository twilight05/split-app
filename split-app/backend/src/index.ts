import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic rout
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Node.js server!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});