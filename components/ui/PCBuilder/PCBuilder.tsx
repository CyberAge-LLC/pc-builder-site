'use client';

import Button from '@/components/ui/Button';
import LogoCloud from '@/components/ui/LogoCloud';
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function PCBuilder() {
  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Central Processing Unit (CPU)
          </h1>
	  <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Graphics Processing Unit (GPU)
          </h1> 	
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Motherboard
          </h1>
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Random Access Memory (RAM)
          </h1>
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Storage (HDD/SSD)
          </h1>
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Power Supply Unit (PSU)
          </h1>
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Cooling System
          </h1>
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Case (Chassis)
          </h1>
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Operating System (OS)
          </h1>
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Peripherals (Monitor, Keyboard, Mouse, etc.)
          </h1>
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}
