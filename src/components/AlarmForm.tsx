import  { useState } from 'react';
import type { Alarm } from '../types/Alarm'; // Importation du type Alarm
// import { v4 as uuidv4 } from 'uuid'; // Plus besoin de uuidv4 si vous utilisez Date.now()

export default function AlarmForm({ onAdd }: { onAdd: (alarm: Alarm) => void }) {
  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');
  const [sound, setSound] = useState('/sounds/beep.mp3');
  const [days, setDays] = useState<string[]>([]);

  const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = e.target.value;
    setSound(url);
    const audio = new Audio(url); // Utilisez l'API Audio native pour précharger
    audio.load();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlarm: Alarm = {
      id: Date.now().toString(), // Reverté à Date.now().toString()
      time,
      label,
      sound,
      isActive: true,
      // Si aucun jour n'est sélectionné, l'alarme est pour tous les jours par défaut
      days: days.length > 0 ? days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      volume: undefined
    };
    onAdd(newAlarm);
    setTime('');
    setLabel('');
    setDays([]);
  };

  const toggleDay = (day: string) => {
    setDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    // Conteneur du formulaire: arrière-plan, texte et transition pour le thème
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 transition-colors duration-200">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ajouter une alarme</h2>

      <div className="mb-4">
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Heure :
        </label>
        <input
          type="time"
          id="time"
          value={time}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
          onChange={e => setTime(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nom de l'alarme :
        </label>
        <input
          type="text"
          id="label"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Label"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="sound" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Son :
        </label>
        <select
          id="sound"
          value={sound}
          onChange={handleSoundChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <option value="/sounds/beep.mp3">Beep</option>
          <option value="/sounds/birds.mp3">Birds</option>
          {/* Assurez-vous que ces chemins sont valides et que les fichiers existent */}
        </select>
      </div>

      <div className="mb-6 flex justify-center space-x-2">
        {weekDays.map(day => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={`
              px-3 py-1 rounded-full text-white transition-colors duration-150
              ${days.includes(day)
                ? 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700' // Couleurs pour le mode sombre lorsque sélectionné
                : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600' // Couleurs pour le mode sombre lorsque non sélectionné
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          >
            {day}
          </button>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md shadow-sm transition-colors duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        Ajouter l'alarme
      </button>
    </form>
  );
}
