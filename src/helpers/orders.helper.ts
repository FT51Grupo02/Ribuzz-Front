export const fetchOrders = async (token: string, userId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las órdenes. Por favor, intenta de nuevo.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la solicitud de órdenes:', error);
    throw error;  // Propagar el error para que pueda ser manejado por el componente
  }
};

// helpers/orderHelper.ts
export const createOrder = async (
    userId: string,
    serviceIds: string[],
    productIds: string[],
    eventIds: string[],
   /*  paymentMethodId: string, */
    token: string
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          service: serviceIds.map(id => ({ id: id.toString() })), // Asegúrate de que `id` sea una cadena
          products: productIds.map(id => ({ id: id.toString() })), // Asegúrate de que `id` sea una cadena
          events: eventIds.map(id => ({ id: id.toString() })), // Asegúrate de que `id` sea una cadena
         /*  payment_method_id: paymentMethodId, */
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear la orden. Por favor, intenta de nuevo.');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error en la solicitud de creación de orden:', error);
      throw error; // Propagar el error para que pueda ser manejado por el componente
    }
  };