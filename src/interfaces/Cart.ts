export interface IProduct {
    type: 'product'; // Añadido campo 'type'
    name: string;
    price: number;
    image: string;
    description?: string;
    stock: number;
    categoryId: number;
    id: number;
    quantity: number;
  }
  
  export interface IService {
    type: 'service'; // Añadido campo 'type'
    name: string;
    price: number;
    description: string;
    id: number;
    quantity: number;
  }
  
  export interface IEvent {
    type: 'event'; // Añadido campo 'type'
    name: string;
    price: number;
    date: string; 
    id: number;
    quantity: number;
  }
  