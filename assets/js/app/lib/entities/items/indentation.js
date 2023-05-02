class Indentation extends Item {
  constructor() {
    super()

    this.name         = 'indentation'
    this.description  = 'Raised stone, not flush with the rest of the wall.'
    this.takeable     = false
  }

  use() {
    setTimeout(() => GemWarrior._playSFX('win'), 2000)
    setTimeout(() => modalOpen('win'), 5000)

    return `You push the ${this.name} as hard as you can, and then a wonderful thing happens: the ${this.name} lodges itself flush with the wall, lights from somewhere plaster the scene with photons, and you finally see where you've been this whole time: a perfectly escapable hole with no turbidity at all.<br /><br />A door nearby creaks open and an 'EXIT' sign illuminates above it, beckoning you.<br /><br />CONGRATULATIONS! YOU WIN!`
  }
}