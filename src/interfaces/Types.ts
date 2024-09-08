import { ICartProduct } from "./Cart";

export interface ILoginPropsUSer {
    email: string;
    password: string;
}

export interface ILoginPropsEntrep {
    email: string;
    password: string;
}

export interface ILoginError {
    email?: string;
    password?: string;
}

export interface IRegisterProps {
    name: string;
    email: string;
    password: string;
    date: Date;
    rol: UserRole; // Hacerlo opcional si el rol no siempre es requerido
}

export type UserRole = 'emprendedor' | 'cliente' | 'admin';

export type IRegisterError = Partial<IRegisterProps>;

export interface IRegisterResponse {
    id: string;
    name: string;
    email: string;
    date: string;
    photo: string | null;
}

export interface IUserSession {
    token: string;  // Token JWT
    user: IUser; 
}

export interface IUser {
    id: string;
    name?: string;
    email: string;
    date?: string;
    photo?: string | null;
    role?: string
}

export interface IOrder {
    id: number;
    status: string;
    date: Date;
    products: ICartProduct[];
}

// Nuevas interfaces basadas en la información proporcionada

export interface ProviderInfo {
    name: string;
    contact: string;
}

export interface SellerInfo {
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

export interface IEvent {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    providerInfo: ProviderInfo;
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
    type: 'event';
}

export interface IService {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    providerInfo: ProviderInfo;
    details?: string[];
    videos?: string[];
    reviews?: Review[];
    publicationDate: string;
    rating?: number;
    type: 'service';
}

export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    videos?: string[];
    images: string[];
    sellerInfo: SellerInfo; 
    categories: Category[];
    details?: string[];
    stock: number;
    reviews?: Review[];
    rating?: number;
    type: 'product';
}

// Función para calcular el rating promedio
export function calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
}

// Funciones para actualizar el rating
export function updateProductRating(product: IProduct): void {
    if (product.reviews) {
        product.rating = calculateAverageRating(product.reviews);
    }
}

export function updateServiceRating(service: IService): void {
    if (service.reviews) {
        service.rating = calculateAverageRating(service.reviews);
    }
}

export function updateEventRating(event: IEvent): void {
    if (event.reviews) {
        event.rating = calculateAverageRating(event.reviews);
    }
}