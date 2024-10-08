'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.png';
import { usePathname } from 'next/navigation';

export default function Logo() {
  const pathname: string = usePathname();

  return (
    <Link href='/' className='flex items-center gap-4 z-10'>
      <Image
        src={logo}
        height='50'
        width='50'
        quality={100}
        alt='Serenity Haven logo'
      />
      <span
        className={`${
          pathname === '/' ? 'text-primary-50' : 'text-primary-700'
        }`}
      >
        Serenity Haven
      </span>
    </Link>
  );
}
