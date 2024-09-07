// src/interfaces/IEvent.ts
import { ProviderInfo, Review } from './types';

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