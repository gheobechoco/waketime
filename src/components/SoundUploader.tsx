// src/components/SoundUploader.tsx
import React, { useState } from 'react'; // Importe React et useState

export default function SoundUploader({ onUpload }: { onUpload: (soundUrl: string) => void }) {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Pour l'exemple, nous allons créer une URL d'objet.
      // En production, vous voudriez probablement uploader ce fichier vers un serveur
      // et obtenir une URL permanente.
      const fileUrl = URL.createObjectURL(file);
      onUpload(fileUrl);
    } else {
      setFileName('');
      onUpload('');
    }
  };

    return (
      // CHANGEMENT ICI : Passer de dark:bg-gray-800 à dark:bg-gray-700 pour un meilleur contraste avec le body (dark:bg-gray-900)
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
        <label htmlFor="sound-upload" className="block text-sm font-medium mb-2">
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