import { IProduct } from "@/interfaces/IProduct";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// Función auxiliar para manejar las respuestas de fetch
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Función auxiliar para realizar peticiones fetch
async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    return handleResponse<T>(response);
  } catch (error: any) {
    console.error(`Error en la petición a ${url}:`, error);
    throw new Error(`Error en la petición: ${error.message}`);
  }
}

export async function getProductsDB(): Promise<IProduct[]> {
  return fetchWithErrorHandling<IProduct[]>(`${APIURL}/api/products`, {
    next: { revalidate: 3600 }
  });
}

export async function getProductById(id: string): Promise<IProduct> {
  return fetchWithErrorHandling<IProduct>(`${APIURL}/api/products/${id}`, {
    next: { revalidate: 3600 }
  });
}

export async function getProductsByCategory(categoryId: string): Promise<IProduct[]> {
  const products = await fetchWithErrorHandling<IProduct[]>(`${APIURL}/api/products?category=${categoryId}`, {
    next: { revalidate: 3600 }
  });

  if (!products.length) {
    throw new Error(`No se encontraron productos para la categoría ${categoryId}`);
  }

  return products;
}

export async function createProduct(token: string, productData: IProduct): Promise<IProduct> {
  return fetchWithErrorHandling<IProduct>(`${APIURL}/api/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
}