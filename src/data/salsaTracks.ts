export interface SalsaTrack {
  id: string;
  name: string;
  artist?: string;
  storagePath: string;
  bpm?: number; // Pre-computed for faster loading
}

// Pre-loaded salsa tracks stored in Lovable Cloud Storage
// To add tracks: upload audio files to the 'tracks' bucket and add entries here
export const SALSA_TRACKS: SalsaTrack[] = [
  { 
    id: 'salsa-clasica', 
    name: 'Salsa Clásica', 
    storagePath: 'salsa-clasica.mp3',
  },
  { 
    id: 'timba-cubana', 
    name: 'Timba Cubana', 
    storagePath: 'timba-cubana.mp3',
  },
  { 
    id: 'rueda-tradicional', 
    name: 'Rueda Tradicional', 
    storagePath: 'rueda-tradicional.mp3',
  },
  { 
    id: 'casino-mix', 
    name: 'Casino Mix', 
    storagePath: 'casino-mix.mp3',
  },
];
