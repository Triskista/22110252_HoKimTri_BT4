const express = require('express');
const { createUser, handleLogin, getUser,
  getAccount, forgotPassword, resetPasswordController
} = require('../controllers/userController');
const { getProductsController, createProductController, updateProductController, deleteProductController } = require('../controllers/productController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const createRateLimiter = require('../middleware/rateLimiter');
const authorize = require('../middleware/authorize');
const { body, validationResult } = require('express-validator');

const routerAPI = express.Router();

// validation helpers
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ EC: 1, EM: 'Validation error', errors: errors.array() });
  }
  next();
}

const authRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });

routerAPI.post("/register",
  authRateLimiter,
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  body('name').notEmpty().withMessage('Name is required'),
  runValidation,
  createUser);

routerAPI.post("/login",
  authRateLimiter,
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  runValidation,
  handleLogin);

routerAPI.post("/forgot-password", body('email').isEmail().withMessage('Invalid email'), runValidation, forgotPassword);
routerAPI.post("/reset-password", body('token').notEmpty().withMessage('Token required'), body('password').isLength({ min: 6 }).withMessage('Password min 6'), runValidation, resetPasswordController);
routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api")
})

// public product listing with pagination / lazy-load support
routerAPI.get('/products', getProductsController);

// protect following endpoints
routerAPI.use(auth);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// admin-only product management endpoints
routerAPI.post('/products', 
  authorize(['admin']),
  body('title').notEmpty().withMessage('Title required'),
  body('price').isNumeric().withMessage('Price must be numeric'),
  runValidation,
  createProductController);

routerAPI.put('/products/:id', 
  authorize(['admin']),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be numeric'),
  runValidation,
  updateProductController);

routerAPI.delete('/products/:id', 
  authorize(['admin']),
  deleteProductController);

module.exports = routerAPI; //export default
