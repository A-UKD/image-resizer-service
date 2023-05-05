// Імпортуємо необхідні модулі та файли
import fs from 'fs';
import path from 'path';
import * as imageUtils from '../utils/imageUtils.js';
import * as uuid from 'uuid';

// Функція для отримання списку всіх зображень
export async function getAllImages() {
    // Отримуємо список файлів з директорії для зображень
    const files = await fs.promises.readdir(imageUtils.imagesDir);

    // Фільтруємо файли за допустимим розширенням зображень та повертаємо список лише зображень
    const imageFiles = files.filter(file => {
        return imageUtils.supportedImageExtensions.includes(path.extname(path.join(imageUtils.imagesDir, file)));
    });
    return imageFiles;
}

// Функція для отримання зображення за його ім'ям
export async function checkAndGetImageByName(name) {
    // Отримуємо список усіх зображень
    const files = await getAllImages();

    // Пошук зображення з заданим ім'ям
    const image = files.find(file => file === name);
    return image;
}

// Функція для видалення зображення за його ім'ям
export async function deleteImageByName(name) {
    // Перевіряємо і получаємо зображення за його ім'ям
    const image = await checkAndGetImageByName(name);

    // Якщо зображення не знайдено, повертаємо false
    if (!image) {
        return false;
    }
    try {
        // Видаляємо зображення за його ім'ям
        await fs.promises.unlink(imageUtils.getImagePath(image));
        return true;
    } catch (error) {
        console.error(error);
    }
    return false;
}

// Функція для завантаження зображення
export async function uploadImage(file) {
    const { originalname, buffer } = file;

    // Отримуємо розширення файлу
    const originalFileExtension = path.extname(originalname);

    // Якщо розширення файлу не є допустимим розширенням зображення, повертаємо false
    if (!imageUtils.supportedImageExtensions.includes(originalFileExtension)) {
        return false;
    }

    try {
        // Генеруємо унікальне ім'я для зображення
        const imageName = uuid.v4() + originalFileExtension;

        // Формуємо повний шлях до зображення
        const imagePath = imageUtils.getImagePath(imageName);

        // Зменшуємо розмір зображення та зберігаємо його в директорії
        const resizedBuffer = await imageUtils.resizeImageBuffer(buffer);
        await fs.promises.writeFile(imagePath, resizedBuffer);

        // Повертаємо ім'я зображення
        return imageName;
    } catch (error) {
        console.error(error);
        return false;
    }
}