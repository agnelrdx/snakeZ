import dayjs from 'dayjs'

export const gridSize = new Array(20).fill('')

const LIMIT = 19 // changes based on grid size

export const initialSnake = ['10:15']

export const initialFood = ['5:10']

export const printSnake = (snake: string[], cord: string) =>
  snake[0] === cord ? 'snake snake-head' : 'snake'

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
) => {
  const headArr = snake[0].split(':')
  const headModified = `${Number(headArr[0]) + row}:${
    Number(headArr[1]) + column
  }`
  if (food.includes(headModified)) {
    const bla = [headModified, ...snake]
    return bla
  }

  return [headModified, ...snake].slice(0, -1)
}

export const validateMove = (
  key: string,
  currentPath: string,
  time: number
) => {
  const diff = dayjs().valueOf() - time
  if (diff < 125) return false
  return validPath[currentPath].includes(key)
}

export const detectCollision = (snake: string[]) => {
  const modifiedSnake = JSON.stringify(snake)
  const regMatch = new RegExp(`${LIMIT + 1}`)
  return (
    /-1/.test(modifiedSnake) ||
    regMatch.test(modifiedSnake) ||
    new Set(snake).size !== snake.length
  )
}

export const ateFood = (snake: string[], food: string[]) => {
  return snake.includes(food[0])
}

export const createFoodBlock = (snake: string[]): any => {
  const foodCord = `${Math.floor(Math.random() * LIMIT + 1)}:${Math.floor(
    Math.random() * LIMIT + 1
  )}`
  if (snake.includes(foodCord)) return createFoodBlock(snake)
  return [foodCord]
}
