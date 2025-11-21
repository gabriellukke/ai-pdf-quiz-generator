'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadPdf } from '@/queries/quiz/hooks';
import { LoadingState } from '@/components/LoadingState';
import { UploadHeader, FileDropzone, ErrorAlert, SubmitButton } from './(home)';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadPdf();

  if (uploadMutation.isPending) {
    return <LoadingState title="Generating Quiz Questions" subtitle="Reading your materials..." />;
  }

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in">
        <UploadHeader />

        <FileDropzone
          file={file}
          dragActive={dragActive}
          disabled={uploadMutation.isPending}
          fileInputRef={fileInputRef}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
        />

        <ErrorAlert error={error} uploadError={uploadMutation.error} />

        {file && !error && (
          <SubmitButton disabled={uploadMutation.isPending} isLoading={uploadMutation.isPending} onClick={handleSubmit} />
        )}
      </div>
    </main>
  );
}
