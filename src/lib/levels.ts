
export interface Level {
  id: number;
  name: string;
  par: number;
  startPosition: [number, number, number];
  holePosition: [number, number, number];
  holeRadius: number;
  obstacles: {
    type: 'box' | 'ramp';
    position: [number, number, number];
    size: [number, number, number];
    rotation?: [number, number, number];
  }[];
  sandpits?: {
    position: [number, number, number];
    radius: number;
  }[];
  trees?: {
    position: [number, number, number];
  }[];
  terrain?: {
    type: 'slope' | 'curve';
  }
}

export const levels: Level[] = [
  // Easy Levels
  {
    id: 1,
    name: 'The First Tee',
    par: 2,
    startPosition: [0, 0.2, 8],
    holePosition: [0, 0.01, -8],
    holeRadius: 0.25,
    obstacles: [],
    sandpits: [
      { position: [3, 0.02, 0], radius: 1.5 },
    ],
    trees: [
      { position: [-5, 0, 2] },
    ]
  },
  {
    id: 2,
    name: "Creekside Crossing",
    par: 4,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.25,
    obstacles: [
      // Bridge
      { type: 'box', position: [0, 0.2, -2], size: [3, 0.4, 4] },
      { type: 'box', position: [-1.5, 0.5, -2], size: [0.2, 0.6, 4] },
      { type: 'box', position: [1.5, 0.5, -2], size: [0.2, 0.6, 4] },
    ],
    sandpits: [
      { position: [3, 0.02, -12], radius: 2 },
      { position: [-3.5, 0.02, -11], radius: 1.5 },
      { position: [0, 0.02, 2], radius: 3},
    ],
    trees: [
      { position: [6, 0, -8] },
      { position: [-7, 0, -5] },
      { position: [8, 0, 0] },
      { position: [-9, 0, 4] },
    ]
  },
   {
    id: 3,
    name: "The Ramp",
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.25,
    obstacles: [
      { type: 'ramp', position: [0, 0.2, -2], size: [3, 0.4, 8], rotation: [-0.2, 0, 0] },
      { type: 'ramp', position: [0, 0.2, 6], size: [3, 0.4, 8], rotation: [0.2, 0, 0] },
    ],
  },
  {
    id: 4,
    name: 'The Corridor',
    par: 4,
    startPosition: [0, 0.2, 14],
    holePosition: [0, 0.01, -14],
    holeRadius: 0.25,
    obstacles: [
      // Main corridor walls
      { type: 'box', position: [2.5, 0.5, 0], size: [0.5, 1, 20] },
      { type: 'box', position: [-2.5, 0.5, 0], size: [0.5, 1, 20] },
      
      // Small blocks near the hole
      { type: 'box', position: [0, 0.25, -12], size: [0.5, 0.5, 0.5] },
      { type: 'box', position: [-1.5, 0.25, -13], size: [0.5, 0.5, 0.5] },
      { type: 'box', position: [1.5, 0.25, -13], size: [0.5, 0.5, 0.5] },
    ],
    sandpits: [
      { position: [0, 0.02, 5], radius: 2 },
      { position: [-4, 0.02, -10], radius: 1.5 },
    ],
    trees: [
      { position: [6, 0, 8] },
      { position: [-6, 0, 2] },
      { position: [5, 0, -15] },
    ]
  },
  {
    id: 5,
    name: 'Precision',
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.2,
    obstacles: [
        { type: 'box', position: [0, 0.5, 5], size: [8, 1, 0.5] },
        { type: 'box', position: [-3, 0.5, -5], size: [2, 1, 0.5] },
        { type: 'box', position: [3, 0.5, -5], size: [2, 1, 0.5] },
    ],
    sandpits: [
        { position: [4, 0.02, 8], radius: 1.5 },
        { position: [0, 0.02, -8], radius: 2 },
    ],
    trees: [
        { position: [6, 0, 0] },
        { position: [-6, 0, 0] },
    ]
  },
  {
    id: 6,
    name: 'The Maze',
    par: 5,
    startPosition: [-8, 0.2, 8],
    holePosition: [8, 0.01, -8],
    holeRadius: 0.25,
    obstacles: [
      // Boundary Walls
      { type: 'box', position: [0, 0.5, 10], size: [20, 1, 0.5] },
      { type: 'box', position: [0, 0.5, -10], size: [20, 1, 0.5] },
      { type: 'box', position: [-10, 0.5, 0], size: [0.5, 1, 20] },
      { type: 'box', position: [10, 0.5, 0], size: [0.5, 1, 20] },

      // Maze layout with multiple paths
      { type: 'box', position: [-5, 0.5, 6], size: [10, 1, 0.5] },
      { type: 'box', position: [5, 0.5, 2], size: [10, 1, 0.5] },
      { type: 'box', position: [0, 0.5, -2], size: [12, 1, 0.5] },
      { type: 'box', position: [-5, 0.5, -6], size: [10, 1, 0.5] },
      
      { type: 'box', position: [-2, 0.5, 1], size: [0.5, 1, 8] },
      { type: 'box', position: [2, 0.5, 6], size: [0.5, 1, 4] },
      { type: 'box', position: [-6, 0.5, -2], size: [0.5, 1, 4] },
      { type: 'box', position: [6, 0.5, -6], size: [0.5, 1, 4] },
    ],
    sandpits: [],
    trees: []
  },
  {
    id: 7,
    name: "The Tunnel",
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.25,
    obstacles: [
      { type: 'box', position: [-1.5, 0.5, 0], size: [0.5, 1, 18] },
      { type: 'box', position: [1.5, 0.5, 0], size: [0.5, 1, 18] },
    ],
  }
];
