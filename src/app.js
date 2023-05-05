// Імпортуємо необхідні модулі та файли
import express from 'express';
import config from 'config';
import imageRoutes from './routes/imageRoutes.js';
import { scheduleCleanup } from './jobs/cleanupJob.js';
import { ensureImageDirectoryExists } from './utils/imageUtils.js';

// Забезпечуємо існування директорії для зображень
ensureImageDirectoryExists();

// Запускаємо задачу очищення старих зображень
scheduleCleanup();

// Зчитуємо налаштування сервера з файлу конфігурації
const serverPort = config.get('server.port');

// Створюємо екземпляр Express-додатка
const app = express();

// Додаємо маршрути для обробки запитів зображень
app.use('/images', imageRoutes);

// Запускаємо сервер на вказаному порті
app.listen(serverPort, () => {
    console.log(`🔥 Сервер запущено на порті: ${serverPort}`);
});