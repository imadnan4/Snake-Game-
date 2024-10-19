import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { GameState } from '../types';
import { Play, RefreshCw } from 'lucide-react';

const CELL_SIZE = 20;
const CANVAS_SIZE = 400;

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('START');
  const { snake, food, score, isGameOver, changeDirection, startGame } = useGame(CANVAS_SIZE, CELL_SIZE);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw background grid
      ctx.strokeStyle = '#e0e0e0';
      for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
        ctx.stroke();
      }

      // Draw snake
      ctx.fillStyle = '#4CAF50';
      snake.forEach(([x, y], index) => {
        const radius = CELL_SIZE / 2;
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius - 1, 0, 2 * Math.PI);
        ctx.fill();

        // Draw eyes for the head
        if (index === 0) {
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(x + radius - 3, y + radius - 3, 2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + radius + 3, y + radius - 3, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      // Draw food
      ctx.fillStyle = '#FF5722';
      const [foodX, foodY] = food;
      const foodRadius = CELL_SIZE / 2;
      ctx.beginPath();
      ctx.arc(foodX + foodRadius, foodY + foodRadius, foodRadius - 1, 0, 2 * Math.PI);
      ctx.fill();
    };

    render();

    if (isGameOver && gameState === 'PLAYING') {
      setGameState('GAME_OVER');
    }
  }, [snake, food, gameState, isGameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;

      switch (e.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, gameState]);

  const handleStart = () => {
    startGame();
    setGameState('PLAYING');
  };

  const handleRestart = () => {
    startGame();
    setGameState('PLAYING');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <motion.h1
        className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Snake Game
      </motion.h1>
      <motion.div
        className="relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-4 border-gray-800 rounded-lg shadow-lg"
        />
        <AnimatePresence>
          {gameState === 'START' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                onClick={handleStart}
                className="px-6 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 flex items-center space-x-2 transform hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={24} />
                <span>Start Game</span>
              </motion.button>
            </motion.div>
          )}
          {gameState === 'GAME_OVER' && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.h2
                className="text-4xl font-bold text-white mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Game Over
              </motion.h2>
              <motion.p
                className="text-2xl text-white mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Score: {score}
              </motion.p>
              <motion.button
                onClick={handleRestart}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 flex items-center space-x-2 transform hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <RefreshCw size={24} />
                <span>Play Again</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="mt-6 text-2xl font-bold bg-white px-6 py-2 rounded-full shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Score: {score}
      </motion.div>
    </div>
  );
};

export default Game;