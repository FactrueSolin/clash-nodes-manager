'use client';
import { useState, useEffect } from 'react';

interface ProxyData {
  id: string;
  name: string;
  type: string;
  ip: string;
  port: number;
  status: boolean;
}

export default function UpdateProxyForm({ proxy }: { proxy: ProxyData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ProxyData>({
    id: '',
    name: '',
    type: '',
    ip: '',
    port: 0,
    status: true
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (proxy) {
      setFormData(proxy);
    }
  }, [proxy]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/proxys', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
         
        },
        body: JSON.stringify({
          ...formData,
          uuid: formData.id
        })
      });
      
      const result = await response.json() as {
        code: number;
        message: string;
        data?: {
          name: string;
          type: string;
          ip: string;
          port: string;
          status: boolean;
          uuid: string;
          updatedAt: string;
        };
      };
      
      if (result.data) {
        setMessage(`节点${result.data.name}更新成功`);
        window.location.reload();
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('更新节点失败，请重试');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded disabled:opacity-50"
      >
        编辑节点
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">编辑节点</h1>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
      
      {message && (
        <div className={`mb-4 p-2 rounded ${message.includes('成功') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="uuid" value={formData.id} />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">节点名称</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">节点类型</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">IP地址</label>
          <input
            type="text"
            name="ip"
            value={formData.ip}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">端口号</label>
          <input
            type="text"
            name="port"
            value={formData.port}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">启用节点</label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          更新节点
        </button>
      </form>
    </div>
  </div>
  )}
</div>
);
}