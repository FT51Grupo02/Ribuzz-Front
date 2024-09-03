'use client'

import { notFound } from 'next/navigation';
import Product from '@/components/ProductDetail/Products'; 
import { Product as ProductType } from '@/components/Cards/types';

interface Props {
  params: {
    productId: string;
  };
}

const fetchProduct = async (productId: string): Promise<ProductType | null> => {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      cache: 'no-store',
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Error fetching product:', response.statusText);
      return null;
    }

    const product: ProductType = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

const ProductPage = async ({ params }: Props) => {
  const { productId } = params;
  const product = await fetchProduct(productId);

  if (!product) {
    notFound();
    return null;
  }

  return (
    <div>
      <Product {...product} />
    </div>
  );
};

export default ProductPage;
