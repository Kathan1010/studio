
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { levels } from '@/lib/levels';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ScoreInfo } from '@/lib/supabase/scores';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBestScores } from '@/lib/supabase/scores';


type LevelsListProps = {
    initialScores: Map<number, ScoreInfo>;
}

export default function LevelsList({ initialScores }: LevelsListProps) {
  const router = useRouter();
  const [scoresMap, setScoresMap] = useState<Map<number, ScoreInfo>>(initialScores);

  useEffect(() => {
    // Optionally, you can re-fetch scores on mount if they might change
    // while the user is on the page, but for now we'll use the server-fetched data.
    // async function fetchScores() {
    //   const scoresData = await getBestScores();
    //   setScoresMap(new Map(scoresData.map(s => [s.level_id, s])));
    // }
    // fetchScores();
  }, []);

  const handlePlayClick = (e: React.MouseEvent<HTMLAnchorElement>, levelId: number) => {
    e.preventDefault();
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
                 <Link 
                    href={`/play?level=${level.id}`}
                    onClick={(e) => handlePlayClick(e, level.id)}
                    className={cn(buttonVariants(), "w-full")}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </Link>
              </CardContent>
            </Card>
          )
        })}
    </div>
  );
}

