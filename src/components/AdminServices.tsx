'use client';
import { useState } from 'react';

type Service = { id: number; name: string; price: number; imageUrl: string };
export default function AdminServices({ initial }: { initial: Service[] }) {
  const [list, setList] = useState(initial);
  const [form, setForm] = useState({ name: '', price: '', imageUrl: '' });

  const refresh = async () => {
    const res = await fetch('/api/services');
    setList(await res.json());
  };

  const add = async () => {
    await fetch('/api/services', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl,
      }),
    });
    setForm({ name: '', price: '', imageUrl: '' });
    refresh();
  };

  const remove = async (id: number) => {
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    refresh();
  };

  // Omitted: edit logic (similar to add + PUT)

  return (
    <div className='p-8'>
      <h1 className='text-2xl mb-4'>Admin: Manage Services</h1>
      <div className='space-y-4 mb-8'>
        <input
          placeholder='Name'
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className='border p-2 rounded w-full'
        />
        <input
          placeholder='Price'
          type='number'
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className='border p-2 rounded w-full'
        />
        <input
          placeholder='Image URL'
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className='border p-2 rounded w-full'
        />
        <button onClick={add} className='px-4 py-2 bg-green-600 text-white rounded'>
          Add Service
        </button>
      </div>
      <ul className='space-y-2'>
        {list.map((svc) => (
          <li key={svc.id} className='flex justify-between items-center border p-2 rounded'>
            <span>
              {svc.name} - ${svc.price.toFixed(2)}
            </span>
            <button
              onClick={() => remove(svc.id)}
              className='px-2 py-1 bg-red-600 text-white rounded'>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
