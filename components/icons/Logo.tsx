import Image from 'next/image';

const Logo = () => {
  return (
    <Image 
      src="https://ogsbootxscuhnzosbkuy.supabase.co/storage/v1/object/public/logo/logo.svg"
      alt="CYBERAGE" 
      width={32} 
      height={32} 
    />
  );
};

export default Logo;