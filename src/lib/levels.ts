
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
    name: 'The Wall',
    par: 2,
    startPosition: [0, 0.2, 8],
    holePosition: [0, 0.01, -8],
    holeRadius: 0.25,
    obstacles: [
      { type: 'box', position: [0, 0.5, 0], size: [4, 1, 0.5] },
    ],
    sandpits: [
      { position: [3, 0.02, -4], radius: 1 },
      { position: [-3, 0.02, 4], radius: 1 },
    ],
    trees: [
      { position: [5, 0, 5] },
      { position: [-5, 0, -5] },
    ]
  },
  {
    id: 3,
    name: 'The Ridge',
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.25,
    obstacles: [
        { type: 'ramp', position: [0, 0.2, 0], size: [8, 0.5, 4], rotation: [0, 0, 0.2] },
        { type: 'ramp', position: [0, 0.2, 0], size: [8, 0.5, 4], rotation: [0, 0, -0.2] },
    ],
    sandpits: [
        { position: [0, 0.02, -8], radius: 2}
    ]
  },
  // Medium Levels
  {
    id: 4,
    name: 'The S-Curve',
    par: 3,
    startPosition: [-4, 0.2, 10],
    holePosition: [4, 0.01, -10],
    holeRadius: 0.25,
    obstacles: [
      { type: 'box', position: [1.5, 0.5, 5], size: [7, 1, 0.5] },
      { type: 'box', position: [-1.5, 0.5, -5], size: [7, 1, 0.5] },
    ],
    sandpits: [
        { position: [0, 0.02, 0], radius: 2 }
    ]
  },
  {
    id: 5,
    name: 'The Tunnel',
    par: 2,
    startPosition: [0, 0.2, 10],
    holePosition: [0, 0.01, -10],
    holeRadius: 0.25,
    obstacles: [
        { type: 'box', position: [-1, 0.5, 0], size: [0.5, 1, 5] },
        { type: 'box', position: [1, 0.5, 0], size: [0.5, 1, 5] },
    ],
    trees: [
        { position: [4, 0, 3] },
        { position: [-4, 0, -3] },
    ]
  },
  // Hard Levels
  {
    id: 6,
    name: 'The Ridge',
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.25,
    obstacles: [
        { type: 'ramp', position: [0, 0.2, 0], size: [8, 0.5, 4], rotation: [0, 0, 0.2] },
        { type: 'ramp', position: [0, 0.2, 0], size: [8, 0.5, 4], rotation: [0, 0, -0.2] },
    ],
    sandpits: [
        { position: [0, 0.02, -8], radius: 2}
    ]
  },
  {
    id: 7,
    name: 'Ricochet',
    par: 5,
    startPosition: [-10, 0.2, 10],
    holePosition: [10, 0.01, -10],
    holeRadius: 0.25,
    obstacles: [
        { type: 'box', position: [0, 0.5, 0], size: [1, 1, 20], rotation: [0, 0.785, 0] },
        { type: 'box', position: [10, 0.5, 0], size: [1, 1, 10] },
        { type: 'box', position: [-10, 0.5, 0], size: [1, 1, 10] },
    ],
    trees: [
        { position: [5, 0, 8] },
        { position: [-5, 0, -8] },
    ]
  },
  {
    id: 8,
    name: 'The Gauntlet',
    par: 5,
    startPosition: [0, 0.2, 14],
    holePosition: [0, 0.01, -14],
    holeRadius: 0.2,
    obstacles: [
        { type: 'box', position: [-1.5, 0.5, 10], size: [1, 1, 4] },
        { type: 'box', position: [1.5, 0.5, 6], size: [1, 1, 4] },
        { type: 'box', position: [-1.5, 0.5, 2], size: [1, 1, 4] },
        { type: 'box', position: [1.5, 0.5, -2], size: [1, 1, 4] },
        { type: 'box', position: [-1.5, 0.5, -6], size: [1, 1, 4] },
        { type: 'box', position: [1.5, 0.5, -10], size: [1, 1, 4] },
    ],
    sandpits: [
        { position: [0, 0.02, 0], radius: 1.2 }
    ]
  },
  {
    id: 9,
    name: 'Vertigo',
    par: 4,
    startPosition: [0, 0.2, 10],
    holePosition: [0, 4.01, -10],
    holeRadius: 0.3,
    obstacles: [
        { type: 'ramp', position: [0, 0.5, 4], size: [4, 1, 6], rotation: [0.4, 0, 0] },
        { type: 'ramp', position: [0, 2.5, -4], size: [4, 1, 6], rotation: [0.4, 0, 0] },
        { type: 'box', position: [0, 3.5, -8], size: [4, 1, 0.5] }
    ],
  },
  {
    id: 10,
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
    trees: [
        { position: [6, 0, 0] },
        { position: [-6, 0, 0] },
    ]
  },
  {
    id: 11,
    name: 'Leap of Faith',
    par: 4,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.25,
    obstacles: [
        { type: 'ramp', position: [0, -0.5, 6], size: [3, 1, 8], rotation: [0.2, 0, 0] },
        { type: 'box', position: [0, 0.5, -6], size: [3, 1, 6] },
    ],
    sandpits: [
        { position: [0, 0.02, 0], radius: 2.5 }
    ]
  },
];
