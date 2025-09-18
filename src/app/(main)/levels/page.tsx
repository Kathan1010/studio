
'use server';

import { getBestScores, type ScoreInfo } from '@/lib/supabase/scores';
import { levels } from '@/lib/levels';
import { LevelsList } from './LevelsList';

export default async function LevelsPage() {
  const scoresData = await getBestScores();
  
  // Create a Map for easy lookup
  const scoresMap = new Map<number, ScoreInfo>(scoresData.map(s => [s.level_id, s]));

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Select a Level</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Challenge yourself with our collection of courses.
          </p>
        </div>
        
        <LevelsList levels={levels} initialScoresMap={scoresMap} />

      </div>
    </div>
  );
}
