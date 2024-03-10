import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import userRouter from './routes/user.route';
import productRouter from './routes/product.route';
import multer from 'multer';
import { addProduct } from './controller/product.controller';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Set the file name for uploaded files 
  }
});

// Initialize Multer middleware for handling file uploads
export const upload = multer({ storage: storage });

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware for enabling CORS
app.use(cors());

// Middleware for parsing JSON and urlencoded request bodies using bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for logging request information
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  const contentLength = req.headers['content-length'];
  if (contentLength) {
    console.log(`Payload Size: ${contentLength} bytes`);
  }
  next();
});

app.post('/addProduct', upload.array('image', 3), async (req, res) => {
  try {
    await addProduct(req, res);
  } catch (error) {
    console.error("Error in route handler:", error);
    res.status(500).json({ error: "Error handling product upload" });
  }
});


// Initialize Socket.IO server
const io = new Server(server, { cors: { origin: '*' } });

// Export 'io' object for use in other files
export { io };

// Routes
app.use(userRouter, productRouter);

// Start the server
server.listen(PORT, () => {
  console.log(`Socket.IO server listening on port ${PORT}`);
});
