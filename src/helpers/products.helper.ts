import { IProduct } from "@/interfaces/IProduct";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductsDB(): Promise<IProduct[]> {
    try {
        const res = await fetch(`/api/products`, {
            next: { revalidate: 3600 }
        });
        const products: IProduct[] = await res.json();
        return products;
    } catch (error: any) {
        throw new Error(error);
    }
};

export async function getProductsById(id: string): Promise<IProduct> {
    try {
        const products: IProduct[] = await getProductsDB();
        const productFiltered = products.find((product) => product.id.toString() === id);
        if (!productFiltered) throw new Error("No se encontró el producto");
        return productFiltered;
    } catch (error: any) {
        throw new Error(error);
    }
};

export async function getProductsByCategory(categoryId: string): Promise<IProduct[]> {
    try {
        const products: IProduct[] = await getProductsDB();
        const productsByCategory = products.filter((product) => product.categories);
        if (!productsByCategory.length) throw new Error(`No se encontró el producto por ${categoryId}`);
        return productsByCategory;
    } catch (error: any) {
        throw new Error(error);
    }
};