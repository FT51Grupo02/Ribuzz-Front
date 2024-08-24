import { FC } from 'react';
import Product from '@/components/Products/Products';
import { exampleProductData } from '@/components/Products/productData';

const Products: FC = () => {
  return (
    <div>
      <Product {...exampleProductData} />
    </div>
  );
};

export default Products;