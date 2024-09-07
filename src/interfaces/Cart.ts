// src/interfaces/Cart.ts
import { IEvent } from '@/interfaces/IEvent';
import { IService } from '@/interfaces/IService';

export interface ICartEventProduct extends IEvent {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string; // Cambia a tipo string
    stock: number;
    categoryId: number;
    quantity: number;
    publicationDate: string;
    sellerInfo: { name: string; contact: string };
    location: string;
    date: string;
    time: string[];
    duration: string;
    type: "event";
}

export interface ICartServiceProduct extends IService {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string; // Cambia a tipo string
    stock: number;
    categoryId: number;
    quantity: number;
    publicationDate: string;
    sellerInfo: { name: string; contact: string };
    location: string;
    date: string;
    time: string[];
    duration: string;
    type: "service";
}

export type ICartProduct = ICartEventProduct | ICartServiceProduct;