// Імпортуємо необхідні модулі
import path from 'path';
import fs from 'fs';
import __dirname from './__dirname.js';
import sharp from 'sharp';

// Масив підтримуваних типів зображень
export const supportedImageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif',
    '.avif',
    '.tiff',
    '.svg'
];

// Шлях до директорії з зображеннями
export const imagesDir = path.join(__dirname, '..', '..', 'images');

// Функція для перевірки наявності директорії з зображеннями та її створення, якщо потрібно
export function ensureImageDirectoryExists() {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Функція для отримання шляху до зображення за його ім'ям
export function getImagePath(imageName) {
    return path.join(imagesDir, imageName);
}

// Функція для зміни розміру зображення
export async function resizeImageBuffer(buffer) {
    // Створюємо об'єкт sharp з буфером зображення
    const sharpBuffer = sharp(Buffer.from(buffer));
    const imageMetadata = await sharpBuffer.metadata();

    // Отримуємо метадані зображення, включаючи його ширину
    const originalWidth = imageMetadata.width;

    // Зменшуємо ширину зображення до половини оригінальної ширини
    const width = Math.round(originalWidth / 2);

    // Змінюємо розмір зображення та повертаємо буфер даних зображення зі зменшеним розміром
    const resizedImageBuffer = await sharpBuffer
        .resize({ width: width })
        .toBuffer({ resolveWithObject: true });
    return resizedImageBuffer.data;
}

// Функція для отримання URL зображення
export function getImageUrl(req, imageName) {
    return req.protocol + '://' + req.get('host') + '/images/' + imageName;
}