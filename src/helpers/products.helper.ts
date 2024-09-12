import { IProduct } from "@/interfaces/IProduct";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductsDB(): Promise<IProduct[]> {
    try {
        const res = await fetch(`${APIURL}/api/products`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const products: IProduct[] = await res.json();
        return products;
    } catch (error: any) {
        console.error("Error fetching products:", error);
        throw new Error(`Failed to fetch products: ${error.message}`);
    }
}

export async function getProductById(id: string): Promise<IProduct> {
    try {
        const res = await fetch(`${APIURL}/api/products/${id}`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const product: IProduct = await res.json();
        return product;
    } catch (error: any) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw new Error(`Failed to fetch product: ${error.message}`);
    }
}

export async function getProductsByCategory(categoryId: string): Promise<IProduct[]> {
    try {
        const res = await fetch(`${APIURL}/api/products?category=${categoryId}`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const products: IProduct[] = await res.json();
        if (!products.length) {
            throw new Error(`No se encontraron productos para la categoría ${categoryId}`);
        }
        return products;
    } catch (error: any) {
        console.error(`Error fetching products for category ${categoryId}:`, error);
        throw new Error(`Failed to fetch products by category: ${error.message}`);
    }
}

export async function createProduct(token: string, productData: IProduct): Promise<IProduct> {
    try {
        const res = await fetch(`${APIURL}/api/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Error al crear el producto');
        }
        return res.json();
    } catch (error: any) {
        console.error("Error creating product:", error);
        throw new Error(`Failed to create product: ${error.message}`);
    }
}