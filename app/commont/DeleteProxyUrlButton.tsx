'use client';
import { useState } from 'react';

export default function DeleteProxyUrlButton({ uuid, onDelete }: { uuid: string, onDelete?: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    if (!confirm('确定要删除这个订阅链接吗？')) return;
    
    setIsDeleting(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/proxyurl', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        
        },
        body: JSON.stringify({ uuid })
      });
      
      const result = await response.json() as {
        code: number;
        message: string;
      };
      
      if (result.code === 1) {
        setMessage('订阅链接删除成功');
        window.location.reload();
        if (onDelete) onDelete();
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('删除订阅链接失败，请重试');
      console.error('Error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded disabled:opacity-50"
      >
        {isDeleting ? '删除中...' : '删除订阅链接'}
      </button>
      
      {message && (
        <span className={`text-sm ${message.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </span>
      )}
    </div>
  );
}