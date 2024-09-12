import { ICartProduct } from "./Cart";

export interface IOrderDetail {
    id: string;
    date: string;
    total: number;
    products?: IProduct[];
    events?: IEvent[];
    services?: IService[];
    pay?: any;
}

export interface ILoginPropsUser {
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
    rol?: UserRole;
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
    token: string;
    user: IUser; 
}

export interface IUser {
    id?: string;
    name: string;
    email: string;
    date?: string;
    photo?: string | null;
    role?: UserRole;
}

export interface IOrder {
    id: number;
    status: string;
    date: Date;
    products: ICartProduct[];
}

export interface ProviderInfo {
    name: string;
    contact: string;
    location?: string;
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
    price: number;
    description: string;
    images: string[];
    videos: string[];
    ProviderInfo: {
    name: string;
    contact: string;
    location: string;
    };
    duration: string;
    date: string;
    time: string[];
    stock: number;
    publicationDate: string;
    type: 'event';
    location: string;
    reviews?: Review[];
    rating?: number;
}

export interface IService {
    id?: string;
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
    categories?: string[];
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

export function calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
}

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