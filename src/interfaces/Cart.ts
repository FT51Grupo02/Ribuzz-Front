import { IEvent } from '@/interfaces/IEvent';
import { IService } from '@/interfaces/IService';
import { IProduct } from '@/interfaces/IProduct';

export interface ICartEvent extends IEvent {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string; 
    stock: number;
    categoryId: number;
    quantity: number;
    publicationDate: string;
    providerInfo: { name: string; contact: string };
    location: string;
    date: string;
    time: string[];
    duration: string;
    type: "event";
}

export interface ICartService extends IService {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
    stock: number;
    categoryId: number;
    quantity: number;
    publicationDate: string;
    providerInfo: { name: string; contact: string };
    location: string;
    date: string;
    time: string[];
    duration: string;
    type: "service";
}
export interface ICartProduct extends IProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
    stock: number;
    categoryId: string;
    quantity: number;
    publicationDate: string;
    sellerInfo: { name: string; contact: string };
    duration: string;
    type: "product";
}
