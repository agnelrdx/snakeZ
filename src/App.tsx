/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import {
  gridSize,
  initialSnake,
  initialFood,
  validateMove,
  getDirection,
  createSnakeBlock,
  detectCollision,
  ateFood,
  createFoodBlock,
  printSnake
} from './utils/helper'
import { useInterval, useEventListener } from './utils/customHooks'
import worm from './assets/worm.png'
import snakeHead from './assets/snake.png'
import music from './assets/music.mp3'

type keyPress = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

const localScore = () => Number(localStorage.getItem('snakeHighScore') || 0)

const App: React.FC = () => {
  const audio = useRef<HTMLElement | null>(null)
  const [snake, setSnake] = useState<string[]>(initialSnake)
  const [food, setFood] = useState<string[]>(initialFood)
  const [interval, setInterval] = useState<number | null>(null)
  const [currentPath, setCurrentPath] = useState<keyPress>('ArrowLeft')
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(localScore())
  const [time, setTime] = useState<number>(dayjs().valueOf())

  useInterval(() => moveSnake(), interval)

  const startGame = () => setInterval(280)

  const handleKeyPress = (e: any) => {
    if (!validateMove(e.key, currentPath, time)) return false
    setCurrentPath(e.key)
    setTime(dayjs().valueOf())
  }
  
  useEffect(() => {
    audio.current.value.play()
  }, [])

  useEffect(() => {
    handleFood()
  }, [snake])

  useEffect(() => {
    if (detectCollision(snake)) gameOver()
  }, [snake])

  useEventListener('keydown', handleKeyPress)

  const handleFood = () => {
    if (ateFood(snake, food)) {
      const newFood = createFoodBlock(snake)
      setFood(newFood)
      setScore(preScore => preScore + 1)
      setInterval(preInterval =>
        Number(preInterval) > 110
          ? Number(preInterval) - 20
          : Number(preInterval) - 2
      )
    }
  }

  const gameOver = () => {
    setInterval(null)
    alert('!!!!!!!!!GAME OVER!!!!!!!!!')
    setSnake(initialSnake)
    if (score > highScore) {
      localStorage.setItem('snakeHighScore', `${score}`)
      setHighScore(score)
    }
  }

  const moveSnake = () => {
    const { row, column } = getDirection(currentPath)
    const updatedSnake = createSnakeBlock(snake, food, row, column)
    setSnake(updatedSnake)
  }

  return (
    <div className="app-snake">
      <h1 className="title">SnakeZ</h1>
      <button
        disabled={interval !== null}
        className="start"
        onClick={startGame}>
        Start Game
      </button>
      <p>High Score - {score > highScore ? score : highScore}</p>
      <div className="grid-container">
        {gridSize.map((_, rowKey) => (
          <div className="row" key={rowKey}>
            {gridSize.map((_, gridKey) => (
              <span
                data-path={`${rowKey}:${gridKey}`}
                className={`grid ${
                  snake.includes(`${rowKey}:${gridKey}`)
                    ? printSnake(snake, `${rowKey}:${gridKey}`)
                    : food.includes(`${rowKey}:${gridKey}`)
                    ? 'food'
                    : ''
                }`.trim()}
                key={gridKey}>
                <img className="worm-img" src={worm} alt="worm" />
                <img className="snake-img" src={snakeHead} alt="snake" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <audio ref={audio}>
        <source src={music} type="audio/mpeg">
      </audio>
    </div>
  )
}

export default App
