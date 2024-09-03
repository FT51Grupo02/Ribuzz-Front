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

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
    sellerInfo: SellerInfo;
    categories: string[];
    details?: string[];
    stock: number;
    rating: number;
    reviews?: Review[];
}

export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
    providerInfo: ProviderInfo;
    details?: string[];
    reviews?: Review[];
    rating: number;
    publicationDate: string;
}

export interface Event {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
    providerInfo: ProviderInfo;
    duration: string;
    location: string;
    rating: number;
    publicationDate: string;
    date: string;
    time: string[];
    stock: number; 
    videos?: string[];
    reviews?: Review[];
}
