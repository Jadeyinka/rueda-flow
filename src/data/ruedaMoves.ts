export interface RuedaMove {
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}

export const ruedaMoves: RuedaMove[] = [
  { name: "Dame", difficulty: "beginner", description: "Pass partner to the right" },
  { name: "Dame Dos", difficulty: "beginner", description: "Pass two partners" },
  { name: "Enchufla", difficulty: "beginner", description: "Hook turn" },
  { name: "Di Le Que No", difficulty: "beginner", description: "Cross body lead" },
  { name: "Guapea", difficulty: "beginner", description: "Basic step in place" },
  { name: "Vacilala", difficulty: "beginner", description: "Show her off" },
  { name: "Exhibela", difficulty: "beginner", description: "Display turn" },
  { name: "Sombrero", difficulty: "intermediate", description: "Hat move over head" },
  { name: "Setenta", difficulty: "intermediate", description: "Seventy - arm wrap" },
  { name: "Mambo", difficulty: "beginner", description: "Mambo break step" },
  { name: "Vasillón", difficulty: "intermediate", description: "Low scoop move" },
  { name: "Mentira", difficulty: "intermediate", description: "The lie - fake out" },
  { name: "Vuelta", difficulty: "beginner", description: "Simple turn" },
  { name: "Dedo", difficulty: "intermediate", description: "Finger spin" },
  { name: "Pelota", difficulty: "intermediate", description: "Ball - circular motion" },
  { name: "Coca Cola", difficulty: "intermediate", description: "Hip motion move" },
  { name: "Adiós", difficulty: "beginner", description: "Goodbye wave" },
  { name: "Prima", difficulty: "intermediate", description: "Cousin move" },
  { name: "Cero", difficulty: "advanced", description: "Zero - complex wrap" },
  { name: "Kentucky", difficulty: "advanced", description: "Advanced combination" },
  { name: "Festival", difficulty: "advanced", description: "Festival de Pelota" },
  { name: "Panqué", difficulty: "intermediate", description: "Cake move" },
  { name: "Beso", difficulty: "intermediate", description: "Kiss move" },
  { name: "Tarrito", difficulty: "advanced", description: "Little jar wrap" },
];

export const getRandomMove = (moves: RuedaMove[]): RuedaMove => {
  return moves[Math.floor(Math.random() * moves.length)];
};
