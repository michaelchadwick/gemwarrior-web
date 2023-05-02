class Utils {
  static are_equal(obj1, obj2) {
    const obj1Keys = Object.keys(obj1).sort()
    const obj2Keys = Object.keys(obj2).sort()

    console.log('are_equal', Object.values(obj1), Object.values(obj2))

    if (obj1Keys.length !== obj2Keys.length) {
      return false
    } else {
      const areEqual = obj1Keys.every((key, index) => {
        const objValue1 = obj1[key]
        const objValue2 = obj2[obj2Keys[index]]

        return objValue1 === objValue2
      })

      return areEqual
    }
  }
}
