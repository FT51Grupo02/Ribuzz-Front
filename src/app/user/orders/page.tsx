import Image from 'next/image';
import OrderButton from '@/components/SideBar/OrdersButton';

const OrdersPage = () => {
  return (
    <div className="relative min-h-screen">
      <Image
        src="https://res.cloudinary.com/devnzokpy/image/upload/v1726107105/17_smtwfz.webp"
        alt="Fondo de página"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute inset-0 z-[-1]"
      />
      <div className="bg-black bg-opacity-50 min-h-screen text-white p-4 relative z-10">
        <OrderButton />
      </div>
    </div>
  );
};

export default OrdersPage;
