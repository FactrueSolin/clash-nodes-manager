import Link from 'next/link';
import Hero from './commont/Hero';
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center py-10">
      <Hero />
      <Link 
        href="/dashboard"
        className="mt-10 px-6 py-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      >
        进入仪表盘
      </Link>
    </div>
  );
}