import { ProviderInfo, Review } from './Types';

export interface IEvent {
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
    type: 'event';
}
