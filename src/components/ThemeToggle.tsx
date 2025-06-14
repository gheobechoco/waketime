// src/components/ThemeToggle.tsx
import  { useState, useEffect } from 'react'; // Importe React, useState et useEffect
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'; // Importe les icônes de soleil et de lune de Heroicons

export default function ThemeToggle() {
  // MODIFICATION 1: Correction de la syntaxe de useState pour l'initialisation du thème.
  // La déclaration useState doit être au début du composant et la logique d'initialisation
  // doit être contenue dans la fonction de callback passée à useState.
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark' || (storedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Appliquer ou retirer la classe 'dark' sur l'élément <html>
    document.documentElement.classList.toggle('dark', isDarkMode);
    // Sauvegarder la préférence dans localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    // MODIFICATION 2: Les styles de débogage 'fixed top-4 right-4 z-50' ont été retirés d'ici.
    // Le bouton sera maintenant positionné par les styles de son conteneur (le header).
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-full
        bg-gray-200 dark:bg-gray-700
        hover:bg-gray-300 dark:hover:bg-gray-600
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
      aria-label="Toggle dark mode"
    >
      {isDarkMode
        ? <SunIcon className="h-6 w-6 text-yellow-400" />
        : <MoonIcon className="h-6 w-6 text-gray-800" />
      }
    </button>
  );
}