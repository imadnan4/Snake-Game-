import { useState, useCallback, useEffect } from 'react';
import { Direction } from '../types';

export const useGame = (canvasSize: number, cellSize: number) => {
  const [snake, setSnake] = useState<number[][]>([[0, 0]]);
  const [food, setFood] = useState<number[]>([0, 0]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const generateFood = useCallback(() => {
    const max = canvasSize / cellSize - 1;
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * max) * cellSize,
        Math.floor(Math.random() * max) * cellSize,
      ];
    } while (snake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
    return newFood;
  }, [canvasSize, cellSize, snake]);

  const startGame = useCallback(() => {
    setSnake([[0, 0]]);
    setFood(generateFood());
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
  }, [generateFood]);

  const gameLoop = useCallback(() => {
    if (isGameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = [...newSnake[0]];

      switch (direction) {
        case 'UP':
          head[1] -= cellSize;
          break;
        case 'DOWN':
          head[1] += cellSize;
          break;
        case 'LEFT':
          head[0] -= cellSize;
          break;
        case 'RIGHT':
          head[0] += cellSize;
          break;
      }

      // Check for collisions
      if (
        head[0] < 0 ||
        head[0] >= canvasSize ||
        head[1] < 0 ||
        head[1] >= canvasSize ||
        newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check if snake ate food
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(prevScore => prevScore + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, canvasSize, cellSize, generateFood, isGameOver]);

  useEffect(() => {
    const gameInterval = setInterval(gameLoop, 100);
    return () => clearInterval(gameInterval);
  }, [gameLoop]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setDirection(prevDirection => {
      if (
        (prevDirection === 'UP' && newDirection === 'DOWN') ||
        (prevDirection === 'DOWN' && newDirection === 'UP') ||
        (prevDirection === 'LEFT' && newDirection === 'RIGHT') ||
        (prevDirection === 'RIGHT' && newDirection === 'LEFT')
      ) {
        return prevDirection;
      }
      return newDirection;
    });
  }, []);

  return {
    snake,
    food,
    direction,
    score,
    isGameOver,
    changeDirection,
    startGame,
  };
};