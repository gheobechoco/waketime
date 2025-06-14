export interface Alarm {
  volume: any;
  id: string;        // Identifiant unique de l'alarme
  time: string;      // Heure de l'alarme (format chaîne de caractères, ex: "HH:MM")
  label: string;     // Libellé ou nom de l'alarme
  sound: string;     // URL ou chemin du fichier audio de l'alarme
  isActive: boolean; // Indique si l'alarme est active ou non
  days: string[];    // Tableau des jours de la semaine où l'alarme est active (ex: ['Mon', 'Wed'])
}