// Імпортуємо необхідні модулі та контролери
import express from 'express';
import * as imageController from '../controllers/imageController.js';
import multer from 'multer';

// Створюємо об'єкт для завантаження файлів
const upload = multer();

// Створюємо маршрутизатор
const router = express.Router();

// Додаємо маршрути для обробки запитів
router.get('/', imageController.getAllImages);
router.get('/:name', imageController.getImageByName);
router.post('/', upload.single('image'), imageController.uploadImage);
router.delete('/:name', imageController.deleteImageByName);

// Експортуємо маршрутизатор
export default router;