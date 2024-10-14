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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh', width: '100%' }}>
            <Link href="./cpu" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button style={{ width: '100%' }}>Central Processing Unit (CPU)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh', width: '100%' }}>
            <Link href="./gpu" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
    	        <Button style={{ width: '100%' }}>Graphics Processing Unit (GPU)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh', width: '100%' }}>
            <Link href="./motherboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button style={{ width: '100%' }}>Motherboard</Button>
            </Link>
          </div>  
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh', width: '100%' }}>
            <Link href="./ram" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button style={{ width: '100%' }}>Random Access Memory (RAM)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh', width: '100%' }}>  
            <Link href="./storage" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button style={{ width: '100%' }}>Storage</Button>
            </Link>
          </div> 
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh', width: '100%' }}>
            <Link href="./psu" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button style={{ width: '100%' }}>Power Supply Unit (PSU)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh', width: '100%' }}>
            <Link href="./cooling" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button style={{ width: '100%' }}>Cooling System</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh', width: '100%' }}>
            <Link href="./case" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button style={{ width: '100%' }}>Case (Chassis)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh', width: '100%' }}>
            <Link href="./os" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button style={{ width: '100%' }}>Operating System (OS)</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh', width: '100%' }}>
            <Link href="./peripherals" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
              <Button style={{ width: '100%' }}>Peripherals (Monitor, Keyboad, Mouse, Etc.)</Button>
            </Link>
          </div>  
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}
