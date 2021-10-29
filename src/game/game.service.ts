import { Injectable } from '@nestjs/common'

@Injectable()
export class GameService {
  randomUnique(range, count) {
    const nums: Set<number> = new Set()
    while (nums.size < count) {
      nums.add(Math.floor((Math.random() * 1000) % range))
    }
    return nums
  }

  randomPlayer() {
    return (Math.floor(Math.random() * 10) % 2) + 1
  }

  generateGrid(bomb = 12, size = 6) {
    const bombPosition = this.randomUnique(size * size, bomb)

    const gameGrid = []

    for (let row = 0; row < size; row++) {
      const gameRow = []
      for (let column = 0; column < size; column++) {
        if (bombPosition.has(row * size + column)) gameRow.push(1)
        else gameRow.push(0)
      }
      gameGrid.push(gameRow)
    }

    return gameGrid
  }
}
