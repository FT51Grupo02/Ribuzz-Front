// helpers/apiHelper.ts

const fetchFromApi = async (endpoint: string, params?: URLSearchParams): Promise<any> => {
    try {
      const url = params ? `${process.env.NEXT_PUBLIC_API_URL}${endpoint}?${params.toString()}` : `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
      const response = await fetch(url, {
        cache: 'no-store',
        method: 'GET',
      });
  
      if (!response.ok) {
        console.error('Error fetching data:', response.statusText);
        throw new Error('Network response was not ok');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  
  const buildSearchParams = (params: Record<string, string | number | undefined>): URLSearchParams => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== 'all') {
        searchParams.append(key, value.toString());
      }
    }
    return searchParams;
  };
  
  export const fetchEvent = async (eventId: string): Promise<any> => {
    return fetchFromApi(`/events/${eventId}`);
  };
  
  export const searchEvents = async (params: {
    search?: string;
    publicationDate?: string;
    popularity?: string;
    location?: string;
    currentPage: number;
    limit: number;
  }): Promise<any> => {
    const searchParams = buildSearchParams({
      name: params.search,
      publicationDate: params.publicationDate,
      popularity: params.popularity === 'mostPopular' ? 'alta' : params.popularity === 'leastPopular' ? 'baja' : '',
      location: params.location,
      page: params.currentPage,
      limit: params.limit,
    });
  
    return fetchFromApi('/search/events', searchParams);
  };
  
  export const fetchEventDetails = async (eventId: string): Promise<any> => {
    return fetchFromApi(`/events/${eventId}`);
  };
  
  export const fetchProduct = async (productId: string): Promise<any> => {
    return fetchFromApi(`/products/${productId}`);
  };
  
  export const searchProducts = async (params: {
    search?: string;
    category?: string;
    price?: string;
    popularity?: string;
    currentPage: number;
  }): Promise<any> => {
    const searchParams = buildSearchParams({
      name: params.search,
      categories: params.category !== 'all' ? params.category : undefined,
      orderPrice: params.price === 'highest' ? 'desc' : params.price === 'lowest' ? 'asc' : undefined,
      populate: params.popularity === 'mostPopular' ? 'alta' : params.popularity === 'leastPopular' ? 'baja' : undefined,
      page: params.currentPage,
    });
  
    return fetchFromApi('/search/products', searchParams);
  };
  
  export const fetchService = async (serviceId: string): Promise<any> => {
    return fetchFromApi(`/services/${serviceId}`);
  };
  
  export const searchServices = async (params: {
    search?: string;
    publicationDate?: string;
    popularity?: string;
    location?: string;
    currentPage: number;
    servicesPerPage: number;
  }): Promise<any> => {
    const searchParams = buildSearchParams({
      name: params.search,
      publicationDate: params.publicationDate,
      popularity: params.popularity === 'mostPopular' ? 'alta' : params.popularity === 'leastPopular' ? 'baja' : undefined,
      location: params.location,
      page: params.currentPage,
      limit: params.servicesPerPage,
    });
  
    return fetchFromApi('/search/services', searchParams);
  };