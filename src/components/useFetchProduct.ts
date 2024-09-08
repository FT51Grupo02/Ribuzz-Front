import { useState, useEffect } from 'react';
import { Product as ProductType } from '@/components/Cards/types';

const useFetchProduct = (productId: string) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
          cache: 'no-store',
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Error fetching product: ${response.statusText}`);
        }

        const data: ProductType = await response.json();
        setProduct(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

export default useFetchProduct;
