import dynamic from 'next/dynamic';

const Maps = dynamic(() => import('@/components/SideBar/Maps'), { ssr: false });

const MapsEvent: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white p-4">
      <Maps />
    </div>
  );
};

export default MapsEvent;