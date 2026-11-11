import React from 'react';
import Image from 'next/image';

interface MentoraLogoProps {
  className?: string;
  size?: number;
}

export default function MentoraLogo({ className = '', size = 32 }: MentoraLogoProps) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <Image
        src="/Mentora.svg"
        alt="Mentora Logo"
        width={size}
        height={size}
        priority
        className="w-auto h-auto object-contain"
      />
    </div>
  );
}