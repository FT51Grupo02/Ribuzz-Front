import { IEvent } from "@/interfaces/Types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  next?: { revalidate: number }
};

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
async function fetchWithErrorHandling<T>(url: string, options?: FetchOptions): Promise<T> {
  try {
    const response = await fetch(url, options);
    return handleResponse<T>(response);
  } catch (error: any) {
    console.error(`Error en la petición a ${url}:`, error);
    throw new Error(`Error en la petición: ${error.message}`);
  }
}

// Función para validar el token (ejemplo básico)
function validateToken(token: string): boolean {
  return token.length > 0; // Implementa una validación más robusta según tus necesidades
}

export async function createEvent(token: string, eventData: Omit<IEvent, 'id'>): Promise<IEvent> {
  if (!validateToken(token)) {
    throw new Error('Token inválido');
  }
  return fetchWithErrorHandling<IEvent>(`${APIURL}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
}

// Función para obtener eventos
export async function getEventsDB(): Promise<IEvent[]> {
  return fetchWithErrorHandling<IEvent[]>(`${APIURL}/events`, {
    next: { revalidate: 3600 }
  });
}

// Función para obtener un evento por ID
export async function getEventById(id: string): Promise<IEvent> {
  return fetchWithErrorHandling<IEvent>(`${APIURL}/events/${id}`, {
    next: { revalidate: 3600 }
  });
}

// Función para actualizar un evento
export async function updateEvent(token: string, id: string, eventData: Partial<IEvent>): Promise<IEvent> {
  if (!validateToken(token)) {
    throw new Error('Token inválido');
  }
  return fetchWithErrorHandling<IEvent>(`${APIURL}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
}

// Función para eliminar un evento
export async function deleteEvent(token: string, id: string): Promise<void> {
  if (!validateToken(token)) {
    throw new Error('Token inválido');
  }
  return fetchWithErrorHandling<void>(`${APIURL}/events/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}