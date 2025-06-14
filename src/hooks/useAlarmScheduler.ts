// src/hooks/useAlarmScheduler.ts
import { useEffect, useRef } from 'react'; // Importe useEffect et useRef
import { Howl } from 'howler'; // Importe Howl (assurez-vous que 'howler' est installé)
import type { Alarm } from '../types/Alarm'; // Importation du type Alarm

export function useAlarmScheduler(alarms: Alarm[]) {
  const currentlyPlayingSound = useRef<Howl | null>(null);

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    alarms.forEach(alarm => {
      if (alarm.isActive) {
        const [hour, minute] = alarm.time.split(':').map(Number);
        const now = new Date();
        let alarmTime = new Date();

        alarmTime.setHours(hour, minute, 0, 0);

        if (alarmTime.getTime() < now.getTime()) {
          alarmTime.setDate(alarmTime.getDate() + 1);
        }

        if (alarm.days && alarm.days.length > 0) {
          let foundNextAlarmDay = false;
          for (let i = 0; i < 7; i++) {
            const currentDay = alarmTime.getDay();
            const currentDayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDay];

            if (alarm.days.includes(currentDayName)) {
              if (alarmTime.getTime() < now.getTime() && alarmTime.toDateString() === now.toDateString()) {
                 alarmTime.setDate(alarmTime.getDate() + 7);
              } else {
                 foundNextAlarmDay = true;
                 break;
              }
            }
            alarmTime.setDate(alarmTime.getDate() + 1);
          }

          if (!foundNextAlarmDay) {
            console.log(`No active days found for alarm: ${alarm.label}`);
            return;
          }
        }

        const timeToAlarm = alarmTime.getTime() - now.getTime();

        if (timeToAlarm > 0) {
          const timeoutId = setTimeout(() => {
            console.log(`Alarm "${alarm.label}" triggered at ${alarm.time} on ${alarmTime.toDateString()}`);
            
            if (currentlyPlayingSound.current) {
              console.log('Stopping previous alarm sound.');
              currentlyPlayingSound.current.stop();
              currentlyPlayingSound.current = null;
            }

            const sound = new Howl({
              src: [alarm.sound],
              html5: true
            });
            sound.play();
            currentlyPlayingSound.current = sound;

            if (Notification.permission === 'granted') {
              new Notification('WakeTime Alarm', {
                body: `C'est l'heure de "${alarm.label}" !`,
                icon: '/vite.svg'
              });
            }
          }, timeToAlarm);
          timeoutIds.push(timeoutId);
        } else {
          console.log(`Alarm "${alarm.label}" is in the past or very near, skipping scheduling.`);
        }
      }
    });

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      if (currentlyPlayingSound.current) {
        currentlyPlayingSound.current.stop();
        currentlyPlayingSound.current = null;
      }
    };
  }, [alarms]);
}