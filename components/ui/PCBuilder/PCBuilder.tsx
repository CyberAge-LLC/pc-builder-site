'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import cn from 'classnames';

export default function PCBuilder() {
  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <Link href={'./PartPicker/CPU'}>
            <Button
              label="Central Processing Unit (CPU)"
            />
          </Link>
          <Link href={'./PartPicker/GPU'}>
  	        <Button
              label="Graphics Processing Unit (GPU)"
            />	
          </Link>
          <Link href={'./PartPicker/Motherboard'}>
            <Button
              label="Motherboard"
            />
          </Link>
          <Link href={'./PartPicker/RAM'}>
            <Button
              label="Random Access Memory (RAM)"
            />
          </Link>
          <Link href={'./PartPicker/Storage'}>
            <Button
              label="Storage (SSD/HDD)"
            />
          </Link>
          <Link href={'./PartPicker/PSU'}>
            <Button
              label="Power Supply Unit (PSU)"
            />
          </Link>
          <Link href={'./PartPicker/Cooling System'}>
            <Button
              label="Cooling System"
            />
          </Link>
          <Link href={'./PartPicker/Case'}>
            <Button
              label="Case (Chassis)"
            />
          </Link>
          <Link href={'./PartPicker/OS'}>
            <Button
              label="Operating System (OS)"
            />
          </Link>
          <Link href={{'./PartPicker/Peripherals'}}>
            <Button
              label="Peripherals (Monitor, Keyboard, Mouse, etc."
            />
          </Link>
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}
