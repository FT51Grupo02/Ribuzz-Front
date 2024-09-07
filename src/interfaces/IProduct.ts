export interface IProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    description?: string;
    stock: number;
    categoryId: number;
    quantity: number;
}
