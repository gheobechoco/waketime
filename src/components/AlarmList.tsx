// src/components/AlarmList.tsx
import { useState } from 'react';
import type { Alarm } from '../types/Alarm';
import { SparklesIcon } from '@heroicons/react/24/solid';

export default function AlarmList({ alarms, onToggle, onDelete, onGetMotivation }: {
    alarms: Alarm[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    // La prop onGetMotivation doit maintenant retourner une Promise<string>
    onGetMotivation: (alarmLabel: string) => Promise<string>; 
  }) {
      const [motivationMessage, setMotivationMessage] = useState<string | null>(null);
      const [isLoadingMotivation, setIsLoadingMotivation] = useState<boolean>(false);
  
      const handleGetMotivation = async (alarmLabel: string) => {
        setIsLoadingMotivation(true);
        setMotivationMessage(null); // Efface le message précédent
        try {
          // Appelle la prop et capture le message de motivation retourné
          const message = await onGetMotivation(alarmLabel);
          setMotivationMessage(message); // Met à jour l'état local avec le message
        } catch (error) {
          console.error("Erreur lors de la récupération de la motivation:", error);
          setMotivationMessage("Désolé, impossible d'obtenir une motivation pour le moment.");
        } finally {
          setIsLoadingMotivation(false);
        }
      };
  
      return (
          <ul className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md">
              {alarms.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300 text-center">Aucune alarme pour le moment.</p>
              ) : (
                  alarms.map(alarm => (
                      <li key={alarm.id} className="mb-4 p-4 rounded-md bg-white dark:bg-gray-900 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div className="flex-grow mb-2 sm:mb-0">
                              <strong className="text-lg font-semibold block dark:text-white">{alarm.label}</strong>
                              <span className="text-gray-600 dark:text-gray-300 text-sm">
                                  {alarm.time} ({alarm.days.length > 0 ? alarm.days.join(', ') : 'Tous les jours'})
                              </span>
                          </div>
                          <div className="flex space-x-2 mt-2 sm:mt-0">
                              <button
                                  onClick={() => onToggle(alarm.id)}
                                  className={`
                                      px-4 py-2 rounded-md text-white font-medium transition-colors duration-200
                                      ${alarm.isActive
                                          ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                                          : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                                      }
                                  `}
                              >
                                  {alarm.isActive ? 'Désactiver' : 'Activer'}
                              </button>
                              <button
                                  onClick={() => onDelete(alarm.id)}
                                  className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white font-medium transition-colors duration-200 dark:bg-gray-600 dark:hover:bg-gray-700"
                              >
                                  Supprimer
                              </button>
                              <button
                                onClick={() => handleGetMotivation(alarm.label)}
                                disabled={isLoadingMotivation}
                                className="px-4 py-2 rounded-md bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors duration-200 dark:bg-purple-600 dark:hover:bg-purple-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isLoadingMotivation && (
                                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                )}
                                {!isLoadingMotivation && <SparklesIcon className="h-5 w-5 mr-1" />}
                                Obtenir motivation ✨
                              </button>
                          </div>
                      </li>
                  ))
              )}
              {motivationMessage && (
                <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-800 rounded-md text-yellow-800 dark:text-yellow-200 shadow-inner">
                  <strong className="block mb-2">Message de Motivation :</strong>
                  <p>{motivationMessage}</p>
                </div>
              )}
          </ul>
      );
  }
