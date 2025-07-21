'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Service = { id: number; name: string; description: string; price: number; imageUrl: string };

export default function ServicesGrid({ services }: { services: Service[] }) {
  const [name, setName] = useState('');
  const [fileNumber, setFileNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

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
      body: JSON.stringify({ name, fileNumber, services: Array.from(selected) }),
    });
    setSubmitted(true);
    setName('');
    setFileNumber('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className='w-full !pb-12 max-w-7xl mx-auto !px-6 flex flex-col'>
      <div className='flex flex-col items-center gap-y-6'>
        <Link href='/' className='inline-block !cursor-pointer'>
          <Image src='/dark-logo.png' alt='Logo' width={300} height={300} />
        </Link>
        <h1 className='!text-4xl'>Comfort Menu</h1>
        <div className='w-full md:!px-80 !my-6'>
          <div className='w-full bg-foreground h-0.5 opacity-20 rounded-4xl' />
        </div>
      </div>

      <div className='flex overflow-x-auto max-h-[calc(100vh-20rem)] overflow-y-hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:overflow-y-auto !space-x-8 !space-y-8 md:space-x-0 !p-8 !mt-6'>
        {services && services.length > 0 ? (
          services.map((svc) => (
            <div
              key={svc.id}
              onClick={() => toggle(svc.id)}
              className={`group relative flex-shrink-0 max-h-[17rem] min-h-[17rem] rounded-2xl overflow-hidden cursor-pointer transform transition ease-out hover:shadow-2xl hover:-translate-y-1 ${
                selected.has(svc.id) ? 'ring-4 ring-light-red' : ''
              }`}>
              <h1 className='!text-2xl text-center !mt-10 !mb-9 text-foreground text-nowrap'>
                {svc.name}
              </h1>

              <div className='relative w-full overflow-hidden flex items-center justify-center'>
                {!loadedImages.has(svc.id) && (
                  <div className='absolute inset-0 bg-gray-200 animate-pulse' />
                )}

                {svc.imageUrl && (
                  <div className='w-1/3 h-1/3'>
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
                  </div>
                )}
              </div>

              <div
                className={`!text-xl absolute opacity-0 transition-opacity bottom-4 right-4 font-semibold text-green-700 text-nowrap ${
                  selected.has(svc.id) ? 'opacity-100' : ''
                }`}>
                {svc?.price || svc.price === 0
                  ? svc?.price?.toLocaleString('en-US', { style: 'currency', currency: 'JOD' })
                  : 'Free'}
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
              type='text'
              value={name}
              placeholder='Name'
              className='!bg-white w-full !border-gray-300 !p-3 !rounded-lg focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
              onChange={(event) => {
                const { value } = event?.target;

                setName(value);
              }}
            />
            <input
              type='text'
              value={fileNumber}
              placeholder='File Number'
              className='!bg-white w-full !border-gray-300 !p-3 !rounded-lg focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
              onChange={(event) => {
                const { value } = event?.target;

                setFileNumber(value);
              }}
            />

            <button
              onClick={submit}
              disabled={!name || !fileNumber}
              className='w-42 disabled:cursor-not-allowed !disabled:bg-gray-200 !py-3 disabled:translate-y-0 !bg-light-red !hover:bg-red-600 !text-white cursor-pointer !text-lg !rounded-lg shadow transition transform hover:-translate-y-0.5'>
              Submit
            </button>
          </div>
          {submitted && (
            <p className='!mt-2 !text-green-700'>Thank you! Your request has been submitted.</p>
          )}
        </>
      )}
    </div>
  );
}
