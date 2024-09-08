export interface Order {
  id: string;
  date: string;
  pay: string;
  Details: {
      total: number;
      products: {
          id: string;
          name: string;
          price: number;
      }[];
  };
}

// Helper para obtener las órdenes del usuario
export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const orders = await response.json();
      console.log("Orders from backend:", orders); // Aquí se muestra lo que viene del backend
      return orders;
  } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
  }
};

// Helper para obtener los detalles de una orden específica
export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` // Autenticación, si es necesario
          }
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const orderDetails = await response.json();
      console.log("Order details from backend:", orderDetails); // Aquí se muestra lo que viene del backend
      return orderDetails;
  } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
  }
};