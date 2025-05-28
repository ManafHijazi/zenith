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
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: number) => {
    const s = new Set(selected);

    if (s.has(id)) s.delete(id);
    else s.add(id);

    setSelected(s);
  };

  const submit = async () => {
    await fetch('/api/services/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, services: Array.from(selected) }),
    });
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className='w-full !pb-12 max-w-7xl mx-auto !px-6 flex flex-col'>
      <div className='flex flex-col items-center gap-y-6'>
        <Link href='/' className='inline-block !cursor-pointer'>
          <Image src='/dark-logo.png' alt='Logo' width={300} height={300} />
        </Link>
        <h1 className='!text-4xl'>Our Services</h1>
        <div className='w-full md:!px-80 !my-6'>
          <div className='w-full bg-foreground h-0.5 opacity-20 rounded-4xl' />
        </div>
      </div>

      <div className='grid overflow-y-auto max-h-[calc(100vh-20rem)] !p-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 !mt-6'>
        {services && services.length > 0 ? (
          services.map((svc) => (
            <div
              key={svc.id}
              onClick={() => toggle(svc.id)}
              className={`group relative max-h-[30rem] min-h-[30rem] bg-white rounded-xl overflow-hidden cursor-pointer transform transition ease-out hover:shadow-2xl hover:-translate-y-1 ${
                selected.has(svc.id) ? 'ring-4 ring-light-red' : ''
              }`}>
              <h1 className='!text-2xl text-center !mt-12 !mb-9 text-foreground'>{svc.name}</h1>
              <div className='relative w-full h-80 overflow-hidden'>
                {!loadedImages.has(svc.id) && (
                  <div className='absolute inset-0 bg-gray-200 animate-pulse' />
                )}

                {svc.imageUrl && (
                  <Image
                    width={300}
                    height={500}
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
            </div>
          ))
        ) : (
          <h1 className='!text-2xl'>No Services</h1>
        )}
      </div>

      {services && services.length > 0 && (
        <>
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
          {submitted && (
            <p className='!mt-2 !text-green-700'>Thank you! Your request has been submitted.</p>
          )}{' '}
        </>
      )}
    </div>
  );
}
