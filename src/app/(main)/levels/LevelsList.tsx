
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { levels } from '@/lib/levels';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ScoreInfo } from '@/lib/supabase/scores';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';


type LevelsListProps = {
    initialScores: Map<number, ScoreInfo>;
}

export default function LevelsList({ initialScores }: LevelsListProps) {
  const router = useRouter();
  const [scoresMap] = useState<Map<number, ScoreInfo>>(initialScores);


  const handlePlayClick = (levelId: number) => {
    router.push(`/play?level=${levelId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => {
          const scoreInfo = scoresMap.get(level.id);
          const bestScore = scoreInfo?.strokes;

          return (
            <Card 
              key={level.id} 
              className={`transition-all hover:border-primary flex flex-col`}
            >
              <CardHeader className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <CardDescription>Hole {level.id}</CardDescription>
                    <CardTitle>{level.name}</CardTitle>
                  </div>
                  <div className="text-right flex flex-col gap-2 items-end">
                    <Badge variant={'outline'}>Par {level.par}</Badge>
                    {bestScore !== undefined && (
                       <Badge variant={bestScore <= level.par ? 'default' : 'secondary'}>
                        Best: {bestScore}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                 <Button 
                    onClick={() => handlePlayClick(level.id)}
                    className="w-full"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </Button>
              </CardContent>
            </Card>
          )
        })}
    </div>
  );
}
