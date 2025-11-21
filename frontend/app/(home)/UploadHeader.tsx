import Image from 'next/image';

export function UploadHeader() {
  return (
    <div className="text-center space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2">
        <Image src="/logo.svg" alt="Unstuck Logo" width={40} height={40} />
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
          Unstuck Quiz Generator
        </h1>
      </div>
      <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto px-4">
        Generate quiz quiz your course materials, or textbooks to help you study faster and smarter.
      </p>
    </div>
  );
}

