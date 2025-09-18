
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBestScores, type ScoreInfo } from '@/lib/supabase/scores';
import { levels } from '@/lib/levels';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';


export default function LevelsPage() {
  const router = useRouter();
  const [scoresMap, setScoresMap] = useState<Map<number, ScoreInfo>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      setIsLoading(true);
      const scoresData = await getBestScores();
      setScoresMap(new Map(scoresData.map(s => [s.level_id, s])));
      setIsLoading(false);
    }
    fetchScores();
  }, []);
  

  const handlePlayClick = (levelId: number) => {
    router.push(`/play?level=${levelId}`);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Select a Level</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Challenge yourself with our collection of courses.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
               <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level) => {
              const scoreInfo = scoresMap.get(level.id);
              const bestScore = scoreInfo?.strokes;

              return (
                <Card 
                  key={level.id} 
                  className="transition-all hover:border-primary flex flex-col"
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
        )}
      </div>
    </div>
  );
}
