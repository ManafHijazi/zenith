'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Service = { id: number; name: string; description: string; price: number; imageUrl: string };

export default function ServicesGrid({ services }: { services: Service[] }) {
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const toggle = (id: number) => {
    const s = new Set(selected);

    if (s.has(id)) s.delete(id);
    else s.add(id);

    setSelected(s);
  };

  const submit = async () => {
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ email, services: Array.from(selected) }),
    });
  };

  return (
    <div className='w-full !pb-12 max-w-7xl mx-auto !px-6 flex flex-col gap-y-6'>
      <div className='flex flex-col items-center gap-y-6'>
        <Link href='/' className='inline-block !cursor-pointer'>
          <Image src='/dark-logo.png' alt='Logo' width={300} height={300} />
        </Link>
        <h1 className='!text-4xl'>Our Services</h1>
        <div className='w-full md:!px-80 !my-6'>
          <div className='w-full bg-foreground h-0.5 opacity-20 rounded-4xl' />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 !mt-6'>
        {services && services.length > 0 ? (
          services.map((svc) => (
            <div
              key={svc.id}
              onClick={() => toggle(svc.id)}
              className={`group relative bg-white rounded-xl overflow-hidden cursor-pointer transform transition ease-out hover:shadow-2xl hover:-translate-y-1 ${
                selected.has(svc.id) ? 'ring-4 ring-light-red' : ''
              }`}>
              <div className='relative w-full h-80 mb-2 overflow-hidden rounded-md'>
                {!loadedImages.has(svc.id) && (
                  <div className='absolute inset-0 bg-gray-200 animate-pulse' />
                )}

                {svc.imageUrl && (
                  <Image
                    width={300}
                    height={200}
                    alt={svc.name}
                    src={svc.imageUrl}
                    className='w-full h-full object-cover transition-opacity'
                    onLoadingComplete={() => {
                      setLoadedImages((prev) => {
                        const next = new Set(prev);

                        next.add(svc.id);

                        return next;
                      });
                    }}
                  />
                )}
              </div>

              <div className='!px-6 !py-3'>
                <h1 className='!text-xl !font-semibold text-foreground group-hover:text-light-red transition-colors'>
                  {svc.name}
                </h1>
                <p className='!mt-1 text-gray-600 text-sm'>{svc.description}</p>
                <p className='!mt-2 text-foreground text-lg font-medium'>${svc.price.toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <h1 className='!text-2xl'>No Services</h1>
        )}
      </div>

      {services && services.length > 0 && (
        <div className='!mt-8 flex !space-x-4'>
          <input
            type='email'
            value={email}
            placeholder='Your email'
            className='!bg-white w-full !border-gray-300 !p-3 !rounded-lg focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
            onChange={(event) => {
              const { value } = event?.target;

              setEmail(value);
            }}
          />

          <button
            onClick={submit}
            disabled={!emailRegex.test(email)}
            className='w-42 disabled:cursor-not-allowed !disabled:bg-gray-200 !py-3 disabled:translate-y-0 !bg-light-red !hover:bg-red-600 !text-white cursor-pointer !text-lg !rounded-lg shadow transition transform hover:-translate-y-0.5'>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
