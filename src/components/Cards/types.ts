export interface SellerInfo {
    name: string;
    contact: string;
}

export interface ProviderInfo {
    name: string;
    contact: string;
}

export interface Review {
    username: string;
    comment: string;
    rating: number;
}

export interface Category {
    id: string;
    name: string;
}

export interface Product {
id: string;
name: string;
description: string;
price: number;
images: string[];
SellerInfo: SellerInfo;
categories: Category[];
details?: string[];
stock: number;
reviews?: Review[];
rating?: number;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    ProviderInfo: ProviderInfo;
    details?: string[];
    reviews?: Review[];
    publicationDate: string;
    rating?: number;
}

export interface Event {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    ProviderInfo: ProviderInfo;
    duration: string;
    location: string;
    reviews?: Review[];
    publicationDate: string;
    date: string;
    time: string[];
    stock: number;
    videos?: string[];
    rating?: number;
    popularity?: string;
}

// Función para calcular el rating promedio

function calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
}

// Funciones para actualizar el rating

function updateProductRating(product: Product): void {
    if (product.reviews) {
        product.rating = calculateAverageRating(product.reviews);
    }
}

function updateServiceRating(service: Service): void {
    if (service.reviews) {
        service.rating = calculateAverageRating(service.reviews);
    }
}

function updateEventRating(event: Event): void {
    if (event.reviews) {
        event.rating = calculateAverageRating(event.reviews);
    }
}