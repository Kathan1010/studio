
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
    name: "The Bridge",
    par: 3,
    startPosition: [0, 0.2, 10],
    holePosition: [0, 0.01, -10],
    holeRadius: 0.25,
    obstacles: [
        { type: 'ramp', position: [0, 0.2, 3], size: [4, 0.5, 8], rotation: [0.25, 0, 0] },
        { type: 'ramp', position: [0, 0.2, -5], size: [4, 0.5, 8], rotation: [-0.25, 0, 0] },
    ],
    sandpits: [
        { position: [4, 0.02, 0], radius: 2 }
    ],
    trees: [
      { position: [-6, 0, 5] },
      { position: [6, 0, -5] },
    ]
  },
  {
    id: 3,
    name: "The Slingshot",
    par: 5,
    startPosition: [0, 0.2, 14],
    holePosition: [0, 0.01, -6],
    holeRadius: 0.25,
    obstacles: [
      // Corridor walls
      { type: 'box', position: [2, 0.5, 8], size: [1, 1, 8] },
      { type: 'box', position: [-2, 0.5, 8], size: [1, 1, 8] },
  
      // U-shaped structure
      { type: 'box', position: [6, 0.5, 0], size: [1, 1, 16] },
      { type: 'box', position: [-6, 0.5, 0], size: [1, 1, 16] },
      { type: 'box', position: [0, 0.5, -8], size: [12, 1, 1] },
      
      // Staggered horizontal barriers
      { type: 'box', position: [1.5, 0.5, 4], size: [9, 1, 0.5] }, // From right wall
      { type: 'box', position: [-1.5, 0.5, -2], size: [9, 1, 0.5] }, // From left wall

      // Small blocks to make it harder
      { type: 'box', position: [0, 0.25, -4.5], size: [0.75, 0.5, 0.75] },
      { type: 'box', position: [2, 0.25, -6.5], size: [0.75, 0.5, 0.75] },
      { type: 'box', position: [-2, 0.25, -6.5], size: [0.75, 0.5, 0.75] },
    ],
    sandpits: [
      { position: [0, 0.02, 1], radius: 1.5 }
    ],
    trees: [
      { position: [8, 0, 8] },
      { position: [-8, 0, 8] },
      { position: [8, 0, -10] },
      { position: [-8, 0, -10] },
    ]
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
    par: 6,
    startPosition: [-8, 0.2, 8],
    holePosition: [8, 0.01, -8],
    holeRadius: 0.25,
    obstacles: [
      // Boundary Walls
      { type: 'box', position: [0, 0.5, 10], size: [20, 1, 0.5] },
      { type: 'box', position: [0, 0.5, -10], size: [20, 1, 0.5] },
      { type: 'box', position: [-10, 0.5, 0], size: [0.5, 1, 20] },
      { type: 'box', position: [10, 0.5, 0], size: [0.5, 1, 20] },

      // Path 1 (Center-Right)
      { type: 'box', position: [-2, 0.5, 6], size: [16, 1, 0.5] },
      { type: 'box', position: [2, 0.5, 2], size: [16, 1, 0.5] },
      { type: 'box', position: [-2, 0.5, -2], size: [16, 1, 0.5] },
      { type: 'box', position: [2, 0.5, -6], size: [16, 1, 0.5] },
      
      // Path 2 (Left)
      { type: 'box', position: [-6, 0.5, 1], size: [0.5, 1, 8] },
      
      // Path 3 (Top)
      { type: 'box', position: [0, 0.5, 6], size: [0.5, 1, 8] },
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
