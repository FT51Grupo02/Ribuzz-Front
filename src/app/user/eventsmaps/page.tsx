import dynamic from 'next/dynamic';

const Maps = dynamic(() => import('@/components/SideBar/Maps'), { ssr: false });

const MapsEvent: React.FC = () => {
  return (
    <div className="bg-black text-white">
      <Maps />
    </div>
  );
};

export default MapsEvent;