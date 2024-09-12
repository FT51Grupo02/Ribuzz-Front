import { IService } from "@/interfaces/Types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// Función auxiliar para manejar las respuestas de fetch
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Respuesta del servidor:', errorData);
    throw new Error(errorData.message || `Error HTTP: ${response.status} ${response.statusText}`);
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

export async function createService(token: string, serviceData: IService): Promise<IService> {
  return fetchWithErrorHandling<IService>(`${APIURL}/services`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });
}

// Función adicional para obtener servicios
export async function getServicesDB(): Promise<IService[]> {
  return fetchWithErrorHandling<IService[]>(`${APIURL}/services`, {
    next: { revalidate: 3600 }
  });
}

// Función adicional para obtener un servicio por ID
export async function getServiceById(id: string): Promise<IService> {
  return fetchWithErrorHandling<IService>(`${APIURL}/services/${id}`, {
    next: { revalidate: 3600 }
  });
}

// Función adicional para actualizar un servicio
export async function updateService(token: string, id: string, serviceData: Partial<IService>): Promise<IService> {
  return fetchWithErrorHandling<IService>(`${APIURL}/services/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });
}

// Función adicional para eliminar un servicio
export async function deleteService(token: string, id: string): Promise<void> {
  return fetchWithErrorHandling<void>(`${APIURL}/services/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}