import _ from 'lodash'
import dayjs from 'dayjs'

export const gridSize = new Array(20).fill('')

const LIMIT = 19 // changes based on grid size

export const initialSnake = { '10:15': 'snake snake-head' }

export const initialFood = { '5:10': 'food' }

export const validPath: { [key: string]: string[] } = {
  ArrowLeft: ['ArrowLeft', 'ArrowUp', 'ArrowDown'],
  ArrowRight: ['ArrowRight', 'ArrowUp', 'ArrowDown'],
  ArrowUp: ['ArrowUp', 'ArrowLeft', 'ArrowRight'],
  ArrowDown: ['ArrowDown', 'ArrowLeft', 'ArrowRight']
}

export const getDirection = (path: string) => {
  switch (path) {
    case 'ArrowLeft':
      return { row: 0, column: -1 }
    case 'ArrowRight':
      return { row: 0, column: 1 }
    case 'ArrowUp':
      return { row: -1, column: 0 }
    case 'ArrowDown':
      return { row: 1, column: 0 }
    default:
      return { row: 0, column: 0 }
  }
}

export const createSnakeBlock = (
  snake: string[],
  food: string[],
  row: number,
  column: number
) =>
  snake.reduce((acc, val, key) => {
    if (key === 0) {
      const head = `${Number(_.head(val.split(':'))) + row}:${
        Number(_.last(val.split(':'))) + column
      }`
      let withFood = {}
      let currentHead = true
      if (food.includes(head)) {
        const updatedRow = row * 2
        const updatedCol = column * 2
        currentHead = false
        withFood = {
          [`${Number(_.head(val.split(':'))) + updatedRow}:${
            Number(_.last(val.split(':'))) + updatedCol
          }`]: 'snake snake-head'
        }
      }
      return {
        ...withFood,
        [`${head}`]: currentHead ? 'snake snake-head' : 'snake',
        ...acc
      }
    }
    return {
      ...acc,
      [`${snake[key - 1]}`]: 'snake'
    }
  }, {})

export const validateMove = (
  key: string,
  currentPath: string,
  time: number
) => {
  const diff = dayjs().valueOf() - time
  if (diff < 150) return false
  return validPath[currentPath].includes(key)
}

export const detectCollision = (snake: string[], updatedSnake: string[]) => {
  return (
    updatedSnake.some(
      (val: string) =>
        ['-1', `${LIMIT + 1}`].includes(val.split(':')[0]) ||
        ['-1', `${LIMIT + 1}`].includes(val.split(':')[1])
    ) || snake.includes(updatedSnake[0])
  )
}

export const ateFood = (snake: string[], food: string[]) => {
  return snake.includes(food[0])
}

export const createFoodBlock = (snake: string[]): any => {
  const path = `${Math.floor(Math.random() * LIMIT + 1)}:${Math.floor(
    Math.random() * LIMIT + 1
  )}`
  if (snake.includes(path)) return createFoodBlock(snake)
  return { [path]: 'food' }
}
