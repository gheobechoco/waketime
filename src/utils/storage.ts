// src/utils/storage.ts
import type { Alarm } from '../types/Alarm'; // Importation du type Alarm

// Définit la clé utilisée pour stocker les alarmes dans le localStorage
const ALARMS_STORAGE_KEY = 'waketime_alarms';

/**
 * Charge les alarmes depuis le localStorage.
 * @returns Un tableau d'objets Alarm. Retourne un tableau vide si aucune alarme n'est trouvée.
 */
export function loadAlarms(): Alarm[] {
  try {
    const storedAlarms = localStorage.getItem(ALARMS_STORAGE_KEY);
    // Si des alarmes sont trouvées, les analyser depuis JSON, sinon retourner un tableau vide.
    return storedAlarms ? JSON.parse(storedAlarms) : [];
  } catch (error) {
    // En cas d'erreur (par ex., JSON invalide), afficher un avertissement et retourner un tableau vide.
    console.warn("Failed to load alarms from localStorage:", error);
    return [];
  }
}

/**
 * Sauvegarde les alarmes dans le localStorage.
 * @param alarms Le tableau d'objets Alarm à sauvegarder.
 */
export function saveAlarms(alarms: Alarm[]): void {
  try {
    // Convertir le tableau d'alarmes en chaîne JSON et le stocker.
    localStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(alarms));
  } catch (error) {
    // En cas d'erreur de stockage (par ex., quota dépassé), afficher un avertissement.
    console.error("Failed to save alarms to localStorage:", error);
  }
}