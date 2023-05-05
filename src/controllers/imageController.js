// Імпортуємо необхідні модулі та класи
import * as imageService from '../services/imageService.js';
import * as imageUtils from '../utils/imageUtils.js';
import { ImageModel } from '../models/imageModel.js';

// Функція для отримання списку всіх зображень
export async function getAllImages(req, res) {
    // Отримуємо список всіх зображень
    const images = await imageService.getAllImages();
    // Повертаємо відповідь зі списком назв зображень та їх URL
    res.json({
        images: images.map(imageName => {
            return new ImageModel(imageName, imageUtils.getImageUrl(req, imageName));
        })
    });
}

// Функція для отримання зображення за ім'ям
export async function getImageByName(req, res) {
    const { name } = req.params;
    if (!name) {
        res.status(400).json({ message: 'Параметр :name обов\`язковий.' });
    }
    const image = await imageService.checkAndGetImageByName(name);
    if (image) {
        // Якщо зображення знайдено, відправляємо його користувачеві
        res.download(imageUtils.getImagePath(image));
    } else {
        // Якщо зображення не знайдено, повертаємо відповідь з помилкою
        res.status(404).json({ message: 'Зображення не знайдено.' });
    }
}

// Функція для видалення зображення за ім'ям
export async function deleteImageByName(req, res) {
    const { name } = req.params;
    if (!name) {
        res.status(400).json({ message: 'Параметр :name обов\`язковий.' });
    }
    const result = await imageService.deleteImageByName(name);
     // Якщо зображення вдало видалено, повертаємо відповідь з підтвердженням
    if (result) {
        res.json({ message: 'Зображення успішно видалено.' });
    } else {
        res.status(404).json({ message: 'Зображення не знайдено.' });
    }
}

// Функція для завантаження зображення
export async function uploadImage(req, res) {
    const file = req.file;
    if (!file) {
        // Якщо файл не було завантажено, повертаємо відповідь з помилкою
        res.status(400).json({ message: 'Файл не було надіслано.' });
        return;
    }
    const imageName = await imageService.uploadImage(file);
    if (!imageName) {
        // Якщо завантаження зображення не вдалося, повертаємо відповідь з помилкою
        res.status(500).json({ message: 'Failed to upload image.' });
        return;
    }
    // Якщо зображення успішно завантажено, повертаємо відповідь з інформацією про зображення
    res.json(new ImageModel(imageName, imageUtils.getImageUrl(req, imageName)));
}