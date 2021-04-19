import React, { useState, useEffect } from 'react'
import _ from 'lodash'
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
  createFoodBlock
} from './utils/helper'
import { useInterval, useEventListener } from './utils/customHooks'
import worm from './assets/worm.png'
import snakeHead from './assets/snake.png'

type keyPress = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

const localScore = Number(localStorage.getItem('snakeHighScore') || 0)

const App: React.FC = () => {
  const [snake, setSnake] = useState<{ [key: string]: string }>(initialSnake)
  const [food, setFood] = useState<{ [key: string]: string }>(initialFood)
  const [interval, setInterval] = useState<number | null>(null)
  const [currentPath, setCurrentPath] = useState<keyPress>('ArrowLeft')
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(localScore)
  const [time, setTime] = useState<number>(dayjs().valueOf())

  useInterval(() => moveSnake(), interval)

  const startGame = () => setInterval(280)

  const handleKeyPress = (e: any) => {
    if (!validateMove(e.key, currentPath, time)) return false
    setCurrentPath(e.key)
    setTime(dayjs().valueOf())
  }

  useEffect(() => {
    handleFood(_.keys(snake), _.keys(food))
  }, [snake, food])

  useEventListener('keydown', handleKeyPress)

  const handleFood = (snakeKeys: string[], foodKeys: string[]) => {
    if (ateFood(snakeKeys, foodKeys)) {
      const newFood = createFoodBlock(snakeKeys)
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
    const highScore = Number(localStorage.getItem('snakeHighScore') || 0)
    if (score > highScore) {
      localStorage.setItem('snakeHighScore', `${score}`)
      setHighScore(score)
    }
  }

  const moveSnake = () => {
    const { row, column } = getDirection(currentPath)
    const snakeKeys = Object.keys(snake)
    const foodKeys = Object.keys(food)
    const updatedSnake = createSnakeBlock(snakeKeys, foodKeys, row, column)
    const updatedSnakeKeys = Object.keys(updatedSnake)
    setSnake(updatedSnake)
    if (detectCollision(snakeKeys, updatedSnakeKeys)) gameOver()
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
      <p>High Score - {highScore}</p>
      <div className="grid-container">
        {gridSize.map((_, rowKey) => (
          <div className="row" key={rowKey}>
            {gridSize.map((_, gridKey) => (
              <span
                data-path={`${rowKey}:${gridKey}`}
                className={`grid ${
                  snake[`${rowKey}:${gridKey}`] ||
                  food[`${rowKey}:${gridKey}`] ||
                  ''
                }`.trim()}
                key={gridKey}>
                <img className="worm-img" src={worm} alt="worm" />
                <img className="snake-img" src={snakeHead} alt="snake" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
