'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

type Service = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

export default function AdminServices({ initial }: { initial: Service[] }) {
  const [list, setList] = useState(initial);
  const [form, setForm] = useState<{
    name: string;
    price: string;
    file: File | null;
  }>({ name: '', price: '', file: null });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    price: string;
    file: File | null;
  }>({ name: '', price: '', file: null });
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoadingId, setEditLoadingId] = useState<number | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);

  const refresh = async () => {
    const res = await fetch('/api/services');
    setList(await res.json());
  };

  const add = async () => {
    setAddLoading(true);
    const data = new FormData();
    data.append('name', form.name);
    data.append('price', form.price);
    if (form.file) data.append('image', form.file);
    await fetch('/api/services', { method: 'POST', body: data });
    setForm({ name: '', price: '', file: null });
    await refresh();
    setAddLoading(false);
  };

  const remove = async (id: number) => {
    setDeleteLoadingId(id);
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    setConfirmId(null);
    await refresh();
    setDeleteLoadingId(null);
  };

  const startEdit = (svc: Service) => {
    setEditingId(svc.id);
    setEditForm({
      name: svc.name,
      price: svc.price.toString(),
      file: null,
    });
  };

  const saveEdit = async (id: number) => {
    setEditLoadingId(id);
    const data = new FormData();
    data.append('name', editForm.name);
    data.append('price', editForm.price);
    if (editForm.file) data.append('image', editForm.file);
    await fetch(`/api/services/${id}`, { method: 'PUT', body: data });
    setEditingId(null);
    await refresh();
    setEditLoadingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className='w-full !pb-12 max-w-7xl mx-auto !px-6 flex flex-col gap-y-6'>
      {/* Header */}
      <div className='flex flex-col items-center gap-y-6'>
        <Link href='/' className='inline-block !cursor-pointer'>
          <Image src='/dark-logo.png' alt='Logo' width={300} height={300} />
        </Link>
        <h1 className='!text-4xl'>Manage Services</h1>
        <div className='w-full md:!px-80 !my-6'>
          <div className='w-full bg-foreground h-0.5 opacity-20 rounded-4xl' />
        </div>
      </div>

      {/* Add Form */}
      <div className='!space-y-4 !mb-8 lg:!w-[50%]'>
        <div className='flex flex-col gap-y-4'>
          <div className='flex !gap-x-2'>
            <input
              placeholder='Name'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className='!p-2 !rounded-lg w-full !bg-white focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
            />
            <input
              placeholder='Price'
              type='number'
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className='!p-2 !rounded-lg w-full !bg-white focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
            />
          </div>

          <input
            type='file'
            accept='image/*'
            onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
            className='!p-2 !cursor-pointer !rounded-lg w-full !bg-white focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
          />
          <button
            onClick={add}
            disabled={addLoading}
            className={`!px-4 !py-2 cursor-pointer !bg-green-600 !text-white !rounded-lg ${
              addLoading ? '!opacity-50' : ''
            }`}>
            {addLoading ? (
              <span className='inline-block w-5 h-5 !border-2 !border-white !border-t-transparent !rounded-full animate-spin' />
            ) : (
              'Add Service'
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-auto rounded-lg w-full'>
        <table className='min-w-full !divide-y !divide-gray-200 w-full'>
          <thead className='bg-light-red w-full'>
            <tr>
              <th className='!px-6 !py-3 !text-left !text-md !font-semibold text-white capitalize tracking-wider'>
                Name
              </th>
              <th className='!px-6 !py-3 !text-left !text-md !font-semibold text-white capitalize tracking-wider'>
                Image
              </th>
              <th className='!px-6 !py-3 !text-left !text-md !font-semibold text-white capitalize tracking-wider'>
                Price
              </th>
              <th className='!px-8 !py-3 !text-right !text-md !font-semibold text-white capitalize tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='!bg-white !divide-y !divide-gray-200 w-full'>
            {list.map((svc) => {
              // Deletion skeleton
              if (deleteLoadingId === svc.id) {
                return (
                  <tr key={svc.id}>
                    <td colSpan={5} className='px-6 py-4'>
                      <div className='h-8 !bg-gray-200 animate-pulse !rounded' />
                    </td>
                  </tr>
                );
              }

              // Edit row
              if (editingId === svc.id) {
                return (
                  <tr key={svc.id}>
                    <td className='!px-6 !py-4 !whitespace-nowrap'>
                      <input
                        placeholder='Name'
                        value={editForm.name}
                        className='!border !p-2 !rounded-lg w-full focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </td>
                    <td className='!px-6 !py-4 !whitespace-nowrap'>
                      <div className='flex items-center !space-x-2'>
                        {editForm.file ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={URL.createObjectURL(editForm.file)}
                            alt='Preview'
                            className='w-12 h-12 object-cover rounded'
                          />
                        ) : svc.imageUrl ? (
                          <Image
                            src={svc.imageUrl}
                            alt={svc.name}
                            width={50}
                            height={50}
                            className='object-cover !rounded'
                          />
                        ) : (
                          <div className='w-12 h-12 bg-gray-100 !rounded' />
                        )}
                        <input
                          type='file'
                          accept='image/*'
                          onChange={(e) =>
                            setEditForm({ ...editForm, file: e.target.files?.[0] || null })
                          }
                          className='!border !cursor-pointer !p-2 !rounded-lg focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
                        />
                      </div>
                    </td>
                    <td className='!px-6 !py-4 !whitespace-nowrap'>
                      <input
                        placeholder='Price'
                        type='number'
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className='!border !p-2 !rounded-lg w-full focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
                      />
                    </td>
                    <td className='!px-6 !py-4 flex !text-right !space-x-2'>
                      <button
                        onClick={() => saveEdit(svc.id)}
                        disabled={editLoadingId === svc.id}
                        className={`inline-flex !cursor-pointer min-w-22 items-center justify-center !p-2 !bg-blue-600 !text-white !rounded-lg ${
                          editLoadingId === svc.id ? 'opacity-50' : ''
                        }`}>
                        {editLoadingId === svc.id ? (
                          <span className='inline-block w-5 h-5 !border-2 !border-white !border-t-transparent !rounded-full animate-spin' />
                        ) : (
                          'Save'
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className='inline-flex items-center justify-center !cursor-pointer min-w-22 !p-2 !bg-gray-300 !text-black !rounded-lg'>
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              }

              // Display row
              return (
                <tr key={svc.id}>
                  <td className='!px-6 !py-4 !whitespace-nowrap'>{svc.name}</td>
                  <td className='!px-6 !py-4 !whitespace-nowrap'>
                    {svc.imageUrl ? (
                      <Image
                        src={svc.imageUrl}
                        alt={svc.name}
                        width={50}
                        height={50}
                        className='object-cover rounded'
                      />
                    ) : (
                      <div className='w-12 h-12 bg-gray-100 rounded' />
                    )}
                  </td>
                  <td className='!px-6 !py-4 !whitespace-nowrap'>${svc.price.toFixed(2)}</td>
                  {/* <td className='!px-6 !py-4 !whitespace-nowrap !truncate max-w-32'>
                    {svc.description}
                  </td> */}
                  <td className='!px-6 !py-4 !text-right !space-x-2 !whitespace-nowrap !flex-nowrap'>
                    <button
                      onClick={() => startEdit(svc)}
                      className='inline-flex !cursor-pointer !p-2 !bg-yellow-500 !text-white !rounded'>
                      <PencilIcon className='h-5 w-5' />
                    </button>
                    <button
                      onClick={() => setConfirmId(svc.id)}
                      className='inline-flex !cursor-pointer !p-2 !bg-red-600 !text-white !rounded'>
                      <TrashIcon className='h-5 w-5' />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirm Dialog */}
      {confirmId !== null && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50'>
          <div className='!bg-white !px-4 !py-3 !rounded-xl !shadow-xl max-w-sm w-full'>
            <p className='!mb-4 !text-gray-800 !text-xl'>
              Are you sure you want to delete this service?
            </p>
            <div className='flex justify-end !space-x-2'>
              <button
                onClick={() => remove(confirmId)}
                disabled={deleteLoadingId === confirmId}
                className={`!px-4 !py-2 !cursor-pointer !bg-red-600 !text-white !rounded-lg ${
                  deleteLoadingId === confirmId ? '!opacity-50' : ''
                }`}>
                {deleteLoadingId === confirmId ? (
                  <span className='inline-block w-5 h-5 !border-2 !border-white !border-t-transparent !rounded-full animate-spin' />
                ) : (
                  'Delete'
                )}
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className='!px-4 !py-2 !cursor-pointer !bg-gray-300 !text-gray-800 !rounded-lg'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
