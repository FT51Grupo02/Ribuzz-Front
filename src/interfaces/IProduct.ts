import { SellerInfo, Review, Category } from './types';

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