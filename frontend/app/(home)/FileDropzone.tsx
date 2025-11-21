import Image from 'next/image';

interface FileDropzoneProps {
  file: File | null;
  dragActive: boolean;
  disabled: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function FileDropzone({
  file,
  dragActive,
  disabled,
  fileInputRef,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange,
  onRemoveFile,
}: FileDropzoneProps) {
  return (
    <div
      className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 transition-all duration-300 ${
        dragActive
          ? 'border-primary-500 bg-primary-50 scale-[1.02] shadow-xl'
          : file
          ? 'border-green-300 bg-green-50 shadow-lg'
          : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
      }`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        id="file-upload"
        accept=".pdf"
        onChange={onFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="text-center space-y-4">
        {file ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 bg-white rounded-xl shadow-sm border border-green-200 max-w-full">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm sm:text-base text-gray-900 font-medium truncate">{file.name}</p>
                <p className="text-xs sm:text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={onRemoveFile}
                className="shrink-0 p-1 hover:bg-red-100 rounded-lg transition-colors"
                disabled={disabled}
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Image
                src="/pdf-folder.svg"
                alt="PDF Upload"
                width={96}
                height={80}
                className={`mx-auto transition-all duration-300 ${dragActive ? 'animate-bounce' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm sm:text-base">
                <label htmlFor="file-upload" className="cursor-pointer text-primary-500 hover:text-primary-600 font-medium transition-colors">
                  Click to upload
                </label>
                <span className="text-gray-600"> or drag and drop files</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 px-2">
                Drop Course Materials and start generating - for <span className="font-semibold">FREE</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

