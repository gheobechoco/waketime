// src/hooks/useAlarmScheduler.ts
import { useEffect, useRef } from 'react'; // Importe useEffect et useRef
import { Howl } from 'howler'; // Importe Howl (assurez-vous que 'howler' est installé)
import type { Alarm } from '../types/Alarm'; // Importation du type Alarm

// Modifiez le hook pour accepter setIsAlarmRinging comme deuxième argument
export function useAlarmScheduler(alarms: Alarm[], setIsAlarmRinging: (isRinging: boolean) => void) {
  const currentlyPlayingSound = useRef<Howl | null>(null);

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    alarms.forEach(alarm => {
      if (alarm.isActive) {
        const [hour, minute] = alarm.time.split(':').map(Number);
        const now = new Date();
        let alarmTime = new Date();

        alarmTime.setHours(hour, minute, 0, 0);

        // Si l'heure de l'alarme est déjà passée aujourd'hui, planifiez-la pour demain
        if (alarmTime.getTime() < now.getTime()) {
          alarmTime.setDate(alarmTime.getDate() + 1);
        }

        // Gérer les jours spécifiques de l'alarme
        if (alarm.days && alarm.days.length > 0) {
          let foundNextAlarmDay = false;
          // Cherche le prochain jour actif pour l'alarme dans les 7 prochains jours
          for (let i = 0; i < 7; i++) {
            const currentDayIndex = alarmTime.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
            const currentDayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDayIndex];

            if (alarm.days.includes(currentDayName)) {
              // Si c'est le jour actuel et que l'heure est passée, passer au même jour la semaine prochaine
              if (alarmTime.getTime() < now.getTime() && alarmTime.toDateString() === now.toDateString()) {
                 alarmTime.setDate(alarmTime.getDate() + 7);
              } else {
                 foundNextAlarmDay = true;
                 break; // Jour trouvé, on peut sortir de la boucle
              }
            }
            // Avancer d'un jour pour vérifier le jour suivant
            alarmTime.setDate(alarmTime.getDate() + 1);
          }

          if (!foundNextAlarmDay) {
            console.log(`No active days found for alarm: ${alarm.label}. Skipping scheduling.`);
            return; // Ne pas planifier l'alarme s'il n'y a pas de jour actif
          }
        }

        const timeToAlarm = alarmTime.getTime() - now.getTime();

        if (timeToAlarm > 0) {
          const timeoutId = setTimeout(() => {
            console.log(`Alarm "${alarm.label}" triggered at ${alarm.time} on ${alarmTime.toDateString()}`);
            
            // Arrête tout son précédent si actif
            if (currentlyPlayingSound.current) {
              console.log('Stopping previous alarm sound.');
              currentlyPlayingSound.current.stop();
              currentlyPlayingSound.current = null;
            }

            // Joue le nouveau son d'alarme
            const sound = new Howl({
              src: [alarm.sound],
              html5: true, // Force HTML5 Audio
              volume: alarm.volume ? alarm.volume / 100 : 0.8 // Utilise le volume de l'alarme ou un défaut
            });
            sound.play();
            currentlyPlayingSound.current = sound;

            // Active l'animation de la cloche
            setIsAlarmRinging(true);
            
            // Désactive l'animation après 3 secondes
            setTimeout(() => {
              setIsAlarmRinging(false);
            }, 3000); // L'animation dure 3 secondes

            // Envoi d'une notification (si la permission est accordée)
            if (Notification.permission === 'granted') {
              new Notification('WakeTime Alarm', {
                body: `C'est l'heure de "${alarm.label}" !`,
                icon: '/vite.svg' // Chemin de votre icône de notification
              });
            }

            // Pour les alarmes récurrentes, replanifiez pour le prochain jour
            // Cette logique dépend de si l'alarme est répétée quotidiennement ou hebdomadairement
            // Pour l'instant, elle se déclenche une fois.
            // Si vous voulez une répétition, il faudrait modifier alarmTime et replanifier un nouveau setTimeout ici.

          }, timeToAlarm);
          timeoutIds.push(timeoutId);
        } else {
          console.log(`Alarm "${alarm.label}" is in the past or very near, skipping scheduling.`);
        }
      }
    });

    // Nettoyage : annule tous les timeouts en attente et arrête le son
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      if (currentlyPlayingSound.current) {
        currentlyPlayingSound.current.stop();
        currentlyPlayingSound.current = null;
      }
    };
  }, [alarms, setIsAlarmRinging]); // Assurez-vous que setIsAlarmRinging est dans les dépendances
}
