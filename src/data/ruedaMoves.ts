export interface RuedaMove {
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
  tutorial?: {
    steps: string[];
    tips: string[];
    videoKeywords?: string;
  };
}

export const ruedaMoves: RuedaMove[] = [
  { 
    name: "Dame", 
    difficulty: "beginner", 
    description: "Pass partner to the right",
    tutorial: {
      steps: [
        "Leader signals 'Dame' on count 1",
        "On count 5-6-7, release partner's hand",
        "Leader steps forward to receive new partner from the left",
        "New partner arrives on count 1 of next phrase"
      ],
      tips: [
        "Keep your right hand up to catch your new partner",
        "Don't rush - let the partner come to you",
        "Maintain the circle formation"
      ]
    }
  },
  { 
    name: "Dame Dos", 
    difficulty: "beginner", 
    description: "Pass two partners",
    tutorial: {
      steps: [
        "Same as Dame but pass two partners",
        "Keep walking forward in the circle",
        "Catch the second partner, not the first",
        "Takes a full 8-count phrase"
      ],
      tips: [
        "Walk steadily, don't speed up",
        "Make eye contact with your target partner",
        "Keep your frame ready"
      ]
    }
  },
  { 
    name: "Enchufla", 
    difficulty: "beginner", 
    description: "Hook turn - partner passes under arm",
    tutorial: {
      steps: [
        "Start in closed position",
        "On 1-2-3, leader raises left arm",
        "Follower walks forward and turns right under the arm",
        "On 5-6-7, both end facing each other"
      ],
      tips: [
        "Keep the arm relaxed, don't push down",
        "Leader steps out of the way",
        "Follower: spot your partner as you turn"
      ]
    }
  },
  { 
    name: "Di Le Que No", 
    difficulty: "beginner", 
    description: "Cross body lead - say no to her",
    tutorial: {
      steps: [
        "Start in closed position",
        "On 1-2-3, leader steps back and opens up",
        "Follower walks across in front of leader",
        "On 5-6-7, close back to position"
      ],
      tips: [
        "Leader: step back and to the left",
        "Create space for follower to pass",
        "This is the most fundamental Rueda move"
      ]
    }
  },
  { 
    name: "Guapea", 
    difficulty: "beginner", 
    description: "Basic step in place",
    tutorial: {
      steps: [
        "Stand facing partner in open position",
        "On 1-2-3, rock back on left foot",
        "On 5-6-7, rock forward toward partner",
        "Repeat continuously"
      ],
      tips: [
        "Keep your frame connected",
        "Use this as your 'resting' step",
        "Stay in rhythm with the group"
      ]
    }
  },
  { 
    name: "Vacilala", 
    difficulty: "beginner", 
    description: "Show her off - follower turns in place",
    tutorial: {
      steps: [
        "From Guapea position",
        "Leader signals by lifting left hand",
        "Follower does a right turn in place",
        "Return to Guapea"
      ],
      tips: [
        "Leader keeps hand light, just a signal",
        "Follower uses momentum for the turn",
        "Keep it stylish - add arm styling!"
      ]
    }
  },
  { 
    name: "Exhibela", 
    difficulty: "beginner", 
    description: "Display turn - showcase your partner",
    tutorial: {
      steps: [
        "Similar to Vacilala",
        "Leader raises arm higher",
        "Follower does a more dramatic turn",
        "Can add styling and flair"
      ],
      tips: [
        "This is about showing off your partner",
        "Followers: add hip movement and arm styling",
        "Make it theatrical!"
      ]
    }
  },
  { 
    name: "Sombrero", 
    difficulty: "intermediate", 
    description: "Hat move - arm goes over head",
    tutorial: {
      steps: [
        "Start with Enchufla",
        "As follower passes, wrap arm over your head",
        "The connected hands create a 'hat'",
        "Unwind with another turn"
      ],
      tips: [
        "Keep your arm relaxed",
        "Don't duck - keep posture tall",
        "Control the unwinding speed"
      ]
    }
  },
  { 
    name: "Setenta", 
    difficulty: "intermediate", 
    description: "Seventy - arm wrap combination",
    tutorial: {
      steps: [
        "Start in open position",
        "Bring follower across with left hand",
        "Wrap follower's arm behind their back",
        "Unwind with a turn"
      ],
      tips: [
        "The name comes from the arm angle",
        "Be gentle with the wrap",
        "Practice the timing slowly first"
      ]
    }
  },
  { 
    name: "Mambo", 
    difficulty: "beginner", 
    description: "Mambo break step",
    tutorial: {
      steps: [
        "Basic mambo step in place",
        "Rock forward on 1, back on 2-3",
        "Rock back on 5, forward on 6-7",
        "Add hip movement and styling"
      ],
      tips: [
        "Keep it bouncy and rhythmic",
        "This is a styling/filler move",
        "Great for catching your breath"
      ]
    }
  },
  { 
    name: "Vasillón", 
    difficulty: "intermediate", 
    description: "Low scoop move",
    tutorial: {
      steps: [
        "From open position",
        "Leader does a low scoop motion",
        "Brings partner in close",
        "Exit with a turn or Di Le Que No"
      ],
      tips: [
        "The scoop should be smooth",
        "Don't pull too hard",
        "Add body wave for style"
      ]
    }
  },
  { 
    name: "Mentira", 
    difficulty: "intermediate", 
    description: "The lie - fake Dame",
    tutorial: {
      steps: [
        "Start as if doing Dame",
        "Release partner but don't let go",
        "Pull partner back to you",
        "Continue with Guapea"
      ],
      tips: [
        "The 'lie' is pretending to give partner away",
        "Timing is crucial for the joke to land",
        "Make it playful!"
      ]
    }
  },
  { 
    name: "Vuelta", 
    difficulty: "beginner", 
    description: "Simple turn",
    tutorial: {
      steps: [
        "Signal with raised left hand",
        "Follower turns to the right",
        "One complete rotation",
        "End facing partner"
      ],
      tips: [
        "Keep the signal clear and early",
        "Follower: spot your partner",
        "Stay on your axis"
      ]
    }
  },
  { 
    name: "Dedo", 
    difficulty: "intermediate", 
    description: "Finger spin",
    tutorial: {
      steps: [
        "Raise your finger",
        "Follower spins around your finger",
        "Keep contact light",
        "Multiple spins optional"
      ],
      tips: [
        "Use just one finger as the pivot",
        "Don't grip - let follower control speed",
        "Very stylish when done smoothly"
      ]
    }
  },
  { 
    name: "Pelota", 
    difficulty: "intermediate", 
    description: "Ball - circular arm motion",
    tutorial: {
      steps: [
        "Bring arms up together",
        "Make a circular motion",
        "Like drawing a ball in the air",
        "Partners mirror each other"
      ],
      tips: [
        "Keep the motion round and smooth",
        "Eye contact makes it better",
        "Can be done multiple times"
      ]
    }
  },
  { 
    name: "Coca Cola", 
    difficulty: "intermediate", 
    description: "Hip motion move",
    tutorial: {
      steps: [
        "From open position",
        "Both partners do hip circles",
        "Can add shoulder shimmies",
        "Very styling-focused move"
      ],
      tips: [
        "This is about attitude!",
        "Exaggerate the hip movement",
        "Have fun with it"
      ]
    }
  },
  { 
    name: "Adiós", 
    difficulty: "beginner", 
    description: "Goodbye - wave and turn",
    tutorial: {
      steps: [
        "Wave goodbye to partner",
        "Turn away from each other",
        "Complete turn and reconnect",
        "End in Guapea"
      ],
      tips: [
        "Make the wave theatrical",
        "Don't actually leave!",
        "Good for transitions"
      ]
    }
  },
  { 
    name: "Prima", 
    difficulty: "intermediate", 
    description: "Cousin - partners trade places",
    tutorial: {
      steps: [
        "From Enchufla position",
        "Both partners continue turning",
        "Trade places with partner",
        "End in opposite positions"
      ],
      tips: [
        "It's like a double Enchufla",
        "Keep moving - don't stop halfway",
        "Watch your partner's path"
      ]
    }
  },
  { 
    name: "Cero", 
    difficulty: "advanced", 
    description: "Zero - complex wrap and unwind",
    tutorial: {
      steps: [
        "Start with Setenta setup",
        "Create a pretzel-like wrap",
        "Multiple turns to unwind",
        "Requires precise timing"
      ],
      tips: [
        "Practice slowly first",
        "Communicate with pressure not pulling",
        "The exit is the tricky part"
      ]
    }
  },
  { 
    name: "Kentucky", 
    difficulty: "advanced", 
    description: "Advanced multi-turn combination",
    tutorial: {
      steps: [
        "Complex entry from Enchufla",
        "Multiple direction changes",
        "Partners weave around each other",
        "Big finish with styling"
      ],
      tips: [
        "This is a showstopper move",
        "Build up to it in practice",
        "Confidence is key"
      ]
    }
  },
  { 
    name: "Festival", 
    difficulty: "advanced", 
    description: "Festival de Pelota - multiple Pelotas",
    tutorial: {
      steps: [
        "Start with Pelota",
        "Continue with multiple rounds",
        "Add variations in height",
        "End with dramatic finish"
      ],
      tips: [
        "Keep the energy building",
        "Vary the speed and height",
        "Great for performances"
      ]
    }
  },
  { 
    name: "Panqué", 
    difficulty: "intermediate", 
    description: "Cake - sweet styling move",
    tutorial: {
      steps: [
        "Enter from Di Le Que No",
        "Add upper body styling",
        "Follower does arm waves",
        "Exit smoothly"
      ],
      tips: [
        "Keep it light and playful",
        "This is all about styling",
        "Make it sweet like cake!"
      ]
    }
  },
  { 
    name: "Beso", 
    difficulty: "intermediate", 
    description: "Kiss - close embrace move",
    tutorial: {
      steps: [
        "Bring partner in close",
        "Brief close embrace",
        "Release and continue",
        "Often followed by Dame"
      ],
      tips: [
        "Keep it tasteful!",
        "The 'kiss' is implied, not literal",
        "Quick and playful"
      ]
    }
  },
  { 
    name: "Tarrito", 
    difficulty: "advanced", 
    description: "Little jar - complex arm wrap",
    tutorial: {
      steps: [
        "Create an arm wrap with partner",
        "Multiple rotations in wrap",
        "Carefully unwind",
        "Requires good connection"
      ],
      tips: [
        "Don't force the wrap",
        "Communication is essential",
        "Practice the exit separately"
      ]
    }
  },
];

export const getRandomMove = (moves: RuedaMove[]): RuedaMove => {
  return moves[Math.floor(Math.random() * moves.length)];
};
