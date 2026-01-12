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
  // Placeholder entries - replace storagePath with actual uploaded file paths
  // { 
  //   id: 'classic-rueda', 
  //   name: 'Classic Rueda', 
  //   artist: 'Salsa Band',
  //   storagePath: 'classic-rueda.mp3', 
  //   bpm: 180 
  // },
];
