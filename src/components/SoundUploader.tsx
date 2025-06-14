// src/components/SoundUploader.tsx
import React, { useState } from 'react';

export default function SoundUploader({ onUpload }: { onUpload: (soundUrl: string) => void }) {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const fileUrl = URL.createObjectURL(file);
      onUpload(fileUrl);
    } else {
      setFileName('');
      onUpload('');
    }
  };

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-colors duration-200">
      <label htmlFor="sound-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Son personnalisé :
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="file"
          id="sound-upload"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => document.getElementById('sound-upload')?.click()}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md transition-colors duration-200 dark:bg-indigo-600 dark:hover:bg-indigo-700"
        >
          Choisir un fichier
        </button>
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {fileName || 'Aucun fichier choisi'}
        </span>
      </div>
    </div>
  );
}