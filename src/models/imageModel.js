// Клас для моделі зображення
export class ImageModel {
    // Конструктор класу, приймає об'єкт назву зображення та його URL
    constructor(image, url) {
        // Зберігаємо назву зображення та його URL в властивості об'єкту
        this.image = image;
        this.url = url;
    }
}