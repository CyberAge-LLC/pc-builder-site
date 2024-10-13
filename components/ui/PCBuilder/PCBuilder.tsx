'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import LogoCloud from '@/components/ui/LogoCloud';
import cn from 'classnames';

export default function PCBuilder() {
  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Link href='/CPU' align-center>
              <Button>Central Processing Unit (CPU)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Link href='/GPU' align-center>
    	        <Button>Graphics Processing Unit (GPU)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Link href='/Motherboard' align-center>
              <Button>Motherboard</Button>
            </Link>
          </div>  
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Link href='/RAM'>
              <Button>Random Access Memory (RAM)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>  
            <Link href='/Storage'>
              <Button>Storage</Button>
            </Link>
          </div> 
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Link href='/PSU'>
              <Button>Power Supply Unit (PSU)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Link href='/Cooling'>
              <Button>Cooling System</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Link href='/Case'>
              <Button>Case (Chassis)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Link href='/OS'>
              <Button>Operating System (OS)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Link href='/Peripherals'>
              <Button>Peripherals (Monitor, Keyboad, Mouse, Etc.)</Button>
            </Link>
          </div>  
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}
