'use client'
import { useRouter } from 'next/navigation'


export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        router.push('/login')
      }
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <button 
      onClick={handleLogout}
     
      className="ml-4"
    >
      登出
    </button>
  )
}

