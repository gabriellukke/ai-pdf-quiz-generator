'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadPdf } from '@/queries/quiz/hooks';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadPdf();

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSuccess = (data: { quiz_id: string }) => {
    router.push(`/edit/${data.quiz_id}`);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        if (droppedFile.size > 10 * 1024 * 1024) {
          setError('File size must be less than 10MB');
          return;
        }
        setFile(droppedFile);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (file) {
      uploadMutation.mutate(file, {
        onSuccess: handleSuccess,
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            AI Quiz Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Transform your PDFs into interactive quizzes powered by AI
          </p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all duration-300 ${
            dragActive
              ? 'border-primary-500 bg-primary-50 scale-[1.02] shadow-xl'
              : file
              ? 'border-green-300 bg-green-50 shadow-lg'
              : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="file-upload"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploadMutation.isPending}
          />

          <div className="text-center space-y-4">
            {file ? (
              <div className="space-y-4 animate-fade-in">
                <div className="inline-flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm border border-green-200">
                  <svg
                    className="w-10 h-10 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-gray-900 font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="flex-shrink-0 p-1 hover:bg-red-100 rounded-lg transition-colors"
                    disabled={uploadMutation.isPending}
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
                  <svg
                    className={`mx-auto h-16 w-16 transition-all duration-300 ${
                      dragActive ? 'text-blue-500 scale-110' : 'text-gray-400'
                    }`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {dragActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 border-4 border-blue-500 border-dashed rounded-full animate-spin-slow opacity-50"></div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Choose PDF
                    </label>
                  </div>
                  <p className="text-gray-600">or drag and drop your file here</p>
                  <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {(error || uploadMutation.isError) && (
          <div className="bg-red-50 border-l-4 border-red-500 px-4 py-3 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">
                {error || (uploadMutation.error instanceof Error ? uploadMutation.error.message : 'Failed to upload PDF. Please try again.')}
              </p>
            </div>
          </div>
        )}

        {file && !error && (
          <button
            onClick={handleSubmit}
            disabled={uploadMutation.isPending}
            className="group w-full bg-primary-500 hover:bg-primary-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
          >
            {uploadMutation.isPending ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Questions...</span>
              </>
            ) : (
              <>
                <span>Generate Quiz</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </main>
  );
}
