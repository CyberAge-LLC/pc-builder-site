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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <Link href="/your-route" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button>Central Processing Unit (CPU)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <Link href="/your-route" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
    	        <Button>Graphics Processing Unit (GPU)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <Link href="/your-route" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button>Motherboard</Button>
            </Link>
          </div>  
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <Link href="/your-route" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button>Random Access Memory (RAM)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>  
            <Link href="/your-route" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button>Storage</Button>
            </Link>
          </div> 
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <Link href="/your-route" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button>Power Supply Unit (PSU)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <Link href="/your-route" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button>Cooling System</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <Link href="/your-route" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button>Case (Chassis)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <Link href="/your-route" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button>Operating System (OS)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <Link href="/your-route" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button>Peripherals (Monitor, Keyboad, Mouse, Etc.)</Button>
            </Link>
          </div>  
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}
