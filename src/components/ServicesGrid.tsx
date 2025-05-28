'use client';
import { useState } from 'react';
import Image from 'next/image';

type Service = { id: number; name: string; price: number; imageUrl: string };
export default function ServicesGrid({ services }: { services: Service[] }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [email, setEmail] = useState('');
  const toggle = (id: number) => {
    const s = new Set(selected);
    if (s.has(id)) {
      s.delete(id);
    } else {
      s.add(id);
    }
    setSelected(s);
  };
  const submit = async () => {
    if (!email) return alert('Enter a valid email.');
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ email, services: Array.from(selected) }),
    });
    alert('Sent!');
  };

  return (
    <div className='p-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {services.map((svc) => (
          <div
            key={svc.id}
            className={
              `border p-4 rounded cursor-pointer ` +
              (selected.has(svc.id) ? 'ring-4 ring-blue-500' : '')
            }
            onClick={() => toggle(svc.id)}>
            {svc.imageUrl && (
              <Image
                src={svc.imageUrl}
                alt={svc.name}
                width={320}
                height={128}
                className='w-full h-32 object-cover rounded'
              />
            )}

            <h3 className='mt-2 font-bold'>{svc.name}</h3>
            <p>${svc.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className='mt-6 flex space-x-2'>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Your email'
          className='border p-2 flex-1 rounded'
        />
        <button onClick={submit} className='px-4 py-2 bg-blue-600 text-white rounded'>
          Submit
        </button>
      </div>
    </div>
  );
}
