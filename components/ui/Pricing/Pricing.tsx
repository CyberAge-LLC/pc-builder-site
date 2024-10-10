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

export default function Pricing() {
  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Custom Built PCs
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            "Build Your Ultimate PC – Tailored Just for You!"
          </p>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Unleash your creativity and performance with our custom PC builds, designed to fit every gamer, creator, and power user. Choose from three expertly crafted tiers of customization:
          </p>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            • Starter Series: The perfect balance of power and affordability – ideal for everyday tasks and light gaming.
          </p>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            • Performance Pro: Boost your gaming and content creation with cutting-edge components for serious multitasking and smoother gameplay.
          </p>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            • Elite Ultra: Experience the ultimate in performance with top-tier hardware, overclocking potential, and the best graphics for those who demand nothing but the best.
          </p>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Your dream build, your way. Pick your tier and customize to perfection!
          </p>
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}
