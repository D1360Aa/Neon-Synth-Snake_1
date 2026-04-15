import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

const SPEEDS: Record<Difficulty, number> = {
  EASY: 200,
  MEDIUM: 150,
  HARD: 100,
};

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameOver) resetGame();
          else setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, SPEEDS[difficulty]);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, isPaused, score, onScoreChange, generateFood, difficulty]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#39FF14' : '#208010';
      ctx.shadowBlur = isHead ? 15 : 0;
      ctx.shadowColor = '#39FF14';
      
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const size = cellSize;
      
      ctx.fillRect(x, y, size, size);
    });

    // Draw food
    ctx.fillStyle = '#FF00FF';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF00FF';
    const foodX = food.x * cellSize + cellSize / 2;
    const foodY = food.y * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.arc(foodX, foodY, cellSize / 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow for text
    ctx.shadowBlur = 0;

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FF00FF';
      ctx.font = 'bold 32px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText('SYSTEM FAILURE', canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillStyle = '#00FFFF';
      ctx.font = '14px "Courier New"';
      ctx.fillText('PRESS SPACE TO REBOOT', canvas.width / 2, canvas.height / 2 + 20);
    } else if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00FFFF';
      ctx.font = 'bold 32px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText('STANDBY', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '14px "Courier New"';
      ctx.fillText('PRESS SPACE TO OVERRIDE', canvas.width / 2, canvas.height / 2 + 20);
    }
  }, [snake, food, gameOver, isPaused]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-[#111] border-4 border-[#222] shadow-[0_0_40px_rgba(57,255,20,0.1)] cursor-none"
        />
        
        {/* Difficulty Selector Overlay */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="mt-16 text-[10px] font-mono text-white/40 uppercase tracking-widest">Select Difficulty</div>
            <div className="mt-2 flex gap-4 pointer-events-auto">
              {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1 font-mono text-[10px] border transition-all ${
                    difficulty === d
                      ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_10px_#00ffff]'
                      : 'text-neon-cyan border-neon-cyan/30 hover:border-neon-cyan'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
