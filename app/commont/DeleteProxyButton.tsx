'use client';
import { useState } from 'react';

export default function DeleteProxyButton({ uuid, onDelete }: { uuid: string, onDelete?: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    if (!confirm('确定要删除这个节点吗？')) return;
    
    setIsDeleting(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/proxys', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'key': 'your-api-key' // 这里需要替换为实际的API key
        },
        body: JSON.stringify({ uuid })
      });
      
      const result = await response.json() as {
        code: number;
        message: string;
      };
      
      if (result.code === 1) {
        setMessage('节点删除成功');
        window.location.reload();
        if (onDelete) onDelete();
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('删除节点失败，请重试');
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
        {isDeleting ? '删除中...' : '删除节点'}
      </button>
      
      {message && (
        <span className={`text-sm ${message.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </span>
      )}
    </div>
  );
}