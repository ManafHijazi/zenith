'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/admin');
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded shadow-md w-full max-w-sm'>
        <h1 className='text-2xl mb-6 text-center'>Admin Sign In</h1>
        {error && <p className='text-red-600 mb-4'>{error}</p>}
        <label className='block mb-2'>
          <span>Username</span>
          <input
            type='text'
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='mt-1 block w-full border p-2 rounded'
          />
        </label>
        <label className='block mb-4'>
          <span>Password</span>
          <input
            type='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='mt-1 block w-full border p-2 rounded'
          />
        </label>
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
          Sign In
        </button>
      </form>
    </div>
  );
}
