class Utils {
  static are_equal(obj1, obj2) {
    const obj1Keys = Object.keys(obj1).sort()
    const obj2Keys = Object.keys(obj2).sort()

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

  static create_custom_item(data) {
    const item_name = (typeof data == 'object') ? data.name : data

    // if (typeof data == 'object') {
    //   console.log(`create_custom_item(${JSON.stringify(data)})`)
    // } else {
    //   console.log(`create_custom_item(${data})`)
    // }

    switch (item_name) {
      case 'bucket': return new Bucket(data)
      case 'cloth': return new Cloth(data)
      case 'etching': return new Etching(data)
      case 'indentation': return new Indentation(data)
      case 'resin': return new Resin(data)
      case 'rock': return new Rock(data)
      case 'stick': return new Stick(data)
      case 'torch': return new Torch(data)
      default:
        return false
    }
  }
}
