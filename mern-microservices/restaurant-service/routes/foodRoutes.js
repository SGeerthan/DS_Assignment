import express from 'express';
import multer from 'multer';
import {
  addFood,
  myFoods,
  updateFood,
  deleteFood
} from '../controllers/foodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer();                    // memory storage

router.use(protect);                        // all routes require auth

router.get('/', myFoods);                   // GET /foods            – list owner’s dishes
router.post('/', upload.single('image'), addFood);         // POST /foods
router.put('/:id', upload.single('image'), updateFood);    // PUT /foods/:id
router.delete('/:id', deleteFood);          // DELETE /foods/:id

export default router;
