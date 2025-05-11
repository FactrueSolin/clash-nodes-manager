'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      const result = await response.json() as {
        code: number;
        message: string;
      };
      if (!response.ok) {
        setError(result.message || '登录失败');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setError('请求失败，请重试');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto p-6 max-w-7xl flex-1 flex flex-col justify-center">
        <div className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300 w-3/4 mx-auto">
        <div>
          <h2 className="text-xl font-semibold">Login</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="key" className="sr-only">Key</label>
              <input
                id="key"
                name="key"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-white-500 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded border-2 border-black ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
