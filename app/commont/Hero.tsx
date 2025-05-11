import Image from 'next/image';

export default function Hero() {
  return (
    <div className="border rounded-lg p-6 shadow-sm flex flex-col-reverse md:flex-row items-center justify-center h-auto md:h-[66.66vh] w-[75vw] mx-auto my-auto">
      <div className="w-1/3 h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <Image 
          src="/android-chrome-512x512.png" 
          alt="Logo" 
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto max-w-[150px] object-contain"
        />
      </div>
      <div className="w-2/3 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-2">clash-nodes-manager</h1>
        <p className="text-gray-500">create by Actrue</p>
      </div>
    </div>
  );
}