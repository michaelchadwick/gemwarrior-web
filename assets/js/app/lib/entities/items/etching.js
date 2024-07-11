class Etching extends Item {
  constructor(options = null) {
    super()

    this.name = 'etching'
    this.description =
      options.description ||
      'Crude scrawling made into the wall reads: "I just wish someone would pick up around here".'
    this.takeable = false
  }

  use() {
    return this.description
  }
}
