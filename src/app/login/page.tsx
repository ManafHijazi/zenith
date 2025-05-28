'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className='!min-h-screen w-full !flex !flex-col !items-center'>
      <div className='flex flex-col items-center gap-y-6'>
        <Link href='/' className='inline-block !cursor-pointer'>
          <Image src='/dark-logo.png' alt='Logo' width={300} height={300} />
        </Link>
        <h1 className='!text-4xl'>Admin Panel</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className='!bg-white !p-8 !rounded-xl !shadow-xl !w-full !max-w-lg !mt-20'>
        <h1 className='!text-2xl !font-semibold !mb-6 !text-left'>Sign In</h1>
        {error && <p className='!text-red-600 !mb-4'>{error}</p>}
        <label className='!block !mb-2'>
          <div className='!mb-1'>Username</div>
          <input
            type='text'
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='!p-2 !rounded-lg !border-light-red !border-2 w-full !bg-white focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
          />
        </label>
        <label className='!block !mb-4'>
          <div className='!mb-1'>Password</div>
          <input
            type='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='!p-2 !rounded-lg !border-light-red !border-2 w-full !bg-white focus:outline-none focus:border-light-red focus:ring-2 focus:ring-light-red transition'
          />
        </label>
        <button
          type='submit'
          className='w-full !mt-6 disabled:cursor-not-allowed !disabled:bg-gray-200 !py-3 disabled:translate-y-0 !bg-light-red !hover:bg-red-600 !text-white cursor-pointer !text-lg !rounded-lg shadow transition transform hover:-translate-y-0.5'>
          Sign In
        </button>
      </form>
    </div>
  );
}
