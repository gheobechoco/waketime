import { useState, useEffect, useRef } from 'react';
import type { Alarm } from './types/Alarm.ts';
import AlarmForm from './components/AlarmForm.tsx';
import { loadAlarms, saveAlarms } from './utils/storage.ts';
import AlarmList from './components/AlarmList.tsx';
import { useAlarmScheduler } from './hooks/useAlarmScheduler.ts';
import ThemeToggle from './components/ThemeToggle.tsx';
import './index.css'; 

function App() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [customSound, setCustomSound] = useState<string>('');

  // Ref pour l'aperçu audio dans la section SoundUploader
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Gère le changement de fichier pour le téléchargement de son personnalisé
  const handleSoundUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCustomSound(url); // Définit l'URL du son personnalisé

    // Optionnel : Joue un aperçu du son après le téléchargement
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.src = url;
      audioPreviewRef.current.load();
      audioPreviewRef.current.play().catch((error: unknown) => console.error("Error playing audio preview:", error));
    }
  };

  useEffect(() => {
    Notification.requestPermission();
    setAlarms(loadAlarms());
  }, []);

  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  useAlarmScheduler(alarms);

  const addAlarm = (alarm: Alarm) => {
    const alarmWithCustomSound = {
      ...alarm,
      // Utilise le son personnalisé si téléchargé, sinon utilise le son du formulaire
      sound: customSound || alarm.sound
    };
    setAlarms((prev: Alarm[]) => [...prev, alarmWithCustomSound]);
  };

  const toggleAlarm = (id: string) => {
    setAlarms((prev: Alarm[]) =>
      prev.map((alarm: Alarm) =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms((prev: Alarm[]) => prev.filter((alarm: Alarm) => alarm.id !== id));
  };

  // Nouvelle fonction pour obtenir une motivation via l'API Gemini
  const getMotivationForAlarm = async (alarmLabel: string): Promise<string> => {
    try {
      const prompt = `Génère une courte phrase de motivation pour se réveiller à cause de l'alarme "${alarmLabel}". Sois encourageant et positif.`;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // La clé API sera automatiquement fournie par Canvas
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        console.error("Erreur lors de la génération de la motivation:", result);
        return "Impossible de générer la motivation. Réponse inattendue de l'IA.";
      }
    } catch (error) {
      console.error("Erreur API Gemini:", error);
      return "Erreur réseau ou du serveur lors de la génération de la motivation.";
    }
  };

  return (
    <div className="min-h-screen">
      <header className="max-w-3xl mx-auto py-6 px-4 mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">⏰ WakeTime</h1>
        <ThemeToggle />
      </header>
      <main className="max-w-3xl mx-auto p-4 space-y-8">
        {/* Section de téléchargement de son - Logique en ligne depuis SoundUploader.tsx */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Son personnalisé (MP3/WAV) :
            <input
              type="file"
              accept="audio/mpeg, audio/wav, audio/ogg"
              onChange={handleSoundUploadChange}
              className="
                mt-1 block w-full text-sm text-gray-700 dark:text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-white file:font-semibold
                file:bg-indigo-600 hover:file:bg-indigo-700
                dark:file:bg-indigo-500 dark:hover:file:bg-indigo-600
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                cursor-pointer
              "
            />
          </label>
          {/* Élément audio caché pour l'aperçu */}
          <audio ref={audioPreviewRef} controls className="hidden">
            Votre navigateur ne supporte pas l'élément audio.
          </audio>
        </div>

        {/* Composant du formulaire d'alarme */}
        <AlarmForm onAdd={addAlarm} />

        {/* Composant de la liste d'alarmes */}
        <AlarmList
          alarms={alarms}
          onToggle={toggleAlarm}
          onDelete={deleteAlarm}
          onGetMotivation={getMotivationForAlarm} 
        />
      </main>
    </div>
  );
}

export default App;
