
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
  },
  {
    id: 3,
    name: 'The Ramp',
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 1.01, -12],
    holeRadius: 0.25,
    obstacles: [
      { type: 'ramp', position: [0, 0, -2], size: [4, 1, 12], rotation: [0.15, 0, 0] },
    ],
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
  },
   {
    id: 6,
    name: 'The Maze',
    par: 5,
    startPosition: [-8, 0.2, 8],
    holePosition: [8, 0.01, -8],
    holeRadius: 0.25,
    obstacles: [
        { type: 'box', position: [-4, 0.5, 4], size: [0.5, 1, 9] },
        { type: 'box', position: [0, 0.5, 0], size: [9, 1, 0.5] },
        { type: 'box', position: [4, 0.5, -4], size: [0.5, 1, 9] },
    ],
  },
  // Hard Levels
  {
    id: 7,
    name: 'The Ridge',
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.25,
    obstacles: [
        { type: 'ramp', position: [0, 0.2, 0], size: [8, 0.5, 4], rotation: [0, 0, 0.2] },
        { type: 'ramp', position: [0, 0.2, 0], size: [8, 0.5, 4], rotation: [0, 0, -0.2] },
    ],
  },
  {
    id: 8,
    name: 'Final Putt',
    par: 3,
    startPosition: [0, 0.2, 14],
    holePosition: [0, 0.01, -14],
    holeRadius: 0.2,
    obstacles: [
        { type: 'box', position: [2, 0.5, 5], size: [1, 1, 1] },
        { type: 'box', position: [-2, 0.5, 0], size: [1, 1, 1] },
        { type: 'box', position: [2, 0.5, -5], size: [1, 1, 1] },
        { type: 'box', position: [-2, 0.5, -10], size: [1, 1, 1] },
    ],
  },
  {
    id: 9,
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
  },
  {
    id: 10,
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
  },
  {
    id: 11,
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
    id: 12,
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
  },
  {
    id: 13,
    name: 'Leap of Faith',
    par: 4,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.25,
    obstacles: [
        { type: 'ramp', position: [0, -0.5, 6], size: [3, 1, 8], rotation: [0.2, 0, 0] },
        { type: 'box', position: [0, 0.5, -6], size: [3, 1, 6] },
    ],
  },
];
