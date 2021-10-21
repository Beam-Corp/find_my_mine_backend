export const randomUnique = (range, count) => {
  const nums = new Set()
  while (nums.size < count) {
    nums.add(Math.floor((Math.random() * 1000) % range))
  }
  return [...nums]
}

export const generateGrid = (bomb: number, size: number) => {
  const bombPosition = randomUnique(size * size, bomb)

  const gameGrid = []

  for (let row = 0; row < size; row++) {
    const gameRow = []
    for (let column = 0; column < size; column++) {
      if (bombPosition[row * size + column]) gameRow.push(1)
      else gameRow.push(0)
    }
    gameGrid.push(gameRow)
  }

  return gameGrid
}
