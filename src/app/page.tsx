
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Layers, MousePointer, Target, Gamepad, Camera, Tv, Trophy, Database, Map, CheckSquare } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { HowToPlay } from '@/components/home/HowToPlay';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-golf-course');

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />

      <main className="flex-1">
        <section
          className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: heroImage ? `url(${heroImage.imageUrl})` : 'none',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="relative z-10 p-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                Web Golf
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)]">
                An interactive 3D minigolf experience, ported from a C-based classic to the modern web with Next.js and Three.js.
              </p>
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg">
                  <Link href="/levels">
                    Play Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
          </div>
        </section>

        <div className="container py-12 md:py-20 space-y-16">
          <HowToPlay />

          <section id="requirements">
            <h2 className="text-3xl font-bold text-center mb-2">
              Project Features
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              An exercise in web-based 3D.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Scene & Asset Rendering', description: 'Initialized a Three.js scene with camera, lighting, and rendering. Loaded 3D models for the course and rendered the golf ball.', icon: <Layers/> },
                { title: 'Basic Physics & Interaction', description: 'Implemented user input to apply velocity to the ball, with simplified friction for realistic movement.', icon: <MousePointer/> },
                { title: 'Core Gameplay & State', description: 'Managed game state like hole, par, and strokes, and implemented goal detection to complete levels.', icon: <Target/> },
                { title: 'Player Controls', description: 'Developed intuitive controls for aiming precision and power, with clear visual feedback for an enhanced user experience.', icon: <Gamepad/> },
                { title: 'Interactive Camera System', description: 'Provided interactive camera controls, including orbit, pan, and zoom, for inspecting the course.', icon: <Camera/> },
                { title: 'User Interface (UI)', description: 'A clean UI displays essential game info like hole number and stroke count, and provides interactive controls.', icon: <Tv /> },
                { title: 'Level Management', description: 'A system was implemented for loading multiple levels with terrain variations like slopes and ramps.', icon: <Map /> },
                { title: 'Level Navigator', description: 'Created a UI for players to select levels and transition between them after completing a hole.', icon: <CheckSquare /> },
                { title: 'Persistent Scoring', description: 'Tracked total scores across all levels, saved in a database linked to email-based authentication so players can continue their progress across sessions.', icon: <Database /> },
              ].map((item) => (
                <Card key={item.title} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {item.icon}
                      </div>
                      <span>{item.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <footer className="border-t bg-gray-50 dark:bg-gray-900/50">
          <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <p className="text-center text-sm leading-loose md:text-left text-muted-foreground">
                Made for CloneFest2025 by team Igniv0x
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
