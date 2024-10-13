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
          <Link href='/CPU'>
            <Button>Central Processing Unit (CPU)</Button>
          </Link>
          <Link href='/GPU'>
  	        <Button>Graphics Processing Unit (GPU)</Button>
          </Link>
          <Link href='/Motherboard'>
            <Button>Motherboard</Button>
          </Link>
          <Link href='/RAM'>
            <Button>Random Access Memory (RAM)</Button>
          </Link>
          <Link href='/Storage'>
            <Button>Storage</Button>
          </Link>
          <Link href='/PSU'>
            <Button>Power Supply Unit (PSU)</Button>
          </Link>
          <Link href='/Cooling'>
            <Button>Cooling System</Button>
          </Link>
          <Link href='/Case'>
            <Button>Case (Chassis)</Button>
          </Link>
          <Link href='/OS'>
            <Button>Operating System (OS)</Button>
          </Link>
          <Link href='/Peripherals'>
            <Button>Peripherals (Monitor, Keyboad, Mouse, Etc.)</Button>
          </Link>
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}
