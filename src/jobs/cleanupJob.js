// Імпортуємо необхідні модулі
import * as cron from 'node-cron';
import * as imageUtils from '../utils/imageUtils.js';
import fs from 'fs';
import { deleteImageByName, getAllImages } from '../services/imageService.js';

// Функція для періодичного видалення старих зображень
export function scheduleCleanup() {
    // Використовуємо модуль node-cron для запуску задачі очищення кожну хвилину
    cron.schedule('* * * * *', async () => {
        // Виводимо повідомлення про початок задачі очищення
        console.log("🧹 Cleanup 🧹");
        // Отримуємо поточну дату та час
        const now = new Date();
        // Отримуємо список всіх зображень
        const images = await getAllImages();
        // Перебираємо кожне зображення та перевіряємо, чи воно старіше 30 хвилин
        for (const image of images) {
            // Отримуємо шлях до файлу зображення
            const imagePath = imageUtils.getImagePath(image);
            // Отримуємо інформацію про файл зображення
            const stat = await fs.promises.stat(imagePath);
             // Обчислюємо різницю в часі між поточним часом та часом останньої зміни файлу
            const timeDifference = now.getTime() - stat.mtime.getTime();
            // Якщо зображення старіше 30 хвилин, видаляємо його
            if (timeDifference > 30 * 60 * 1000) {
                console.log('❌ Зображення старіше 30 хвилин, видаляємо... ', image);
                await deleteImageByName(image);
            } else {
                // Якщо зображення не старіше 30 хвилин, виводимо повідомлення про те, що його не буде видалено
                console.log('🕑 Зображення не старіше 30 хвилин:', image);
            }
        }
    });
}