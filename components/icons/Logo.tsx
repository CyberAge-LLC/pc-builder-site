import Image from 'next/image';

const Logo = () => {
  return (
    <Image 
      src="./logo-icon.svg"
      alt="CYBERAGE" 
      width={64} 
      height={64} 
    />
  );
};

export default Logo;