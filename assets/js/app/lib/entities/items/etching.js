class Etching extends Item {
  constructor() {
    super()

    this.name         = 'etching'
    this.description  = 'Crude scrawling made into the wall reads: "I just wish someone would pick up around here".'
    this.takeable     = false
  }

  use() {
    return this.description
  }
}