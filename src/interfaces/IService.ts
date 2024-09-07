import { ProviderInfo, Review } from './Types';

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