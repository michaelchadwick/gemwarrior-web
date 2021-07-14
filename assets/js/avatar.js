onmessage = function(msg) {
  var xhr = new XMLHttpRequest();

  switch (msg.data) {
    case 'standing':
      xhr.open('GET', '../data/avatar/player-standing.txt')
      xhr.send()
      break
    case 'standing-blink':
      xhr.open('GET', '../data/avatar/player-standing-blink.txt')
      xhr.send()
      break
    case 'sitting':
      xhr.open('GET', '../data/avatar/player-sitting.txt')
      xhr.send()
      break
    case 'sitting-blink':
      xhr.open('GET', '../data/avatar/player-sitting-blink.txt')
      xhr.send()
      break
    case 'reclining1':
      xhr.open('GET', '../data/avatar/player-reclining1.txt')
      xhr.send()
      break
    case 'reclining2':
      xhr.open('GET', '../data/avatar/player-reclining2.txt')
      xhr.send()
      break
    case 'reclining3':
      xhr.open('GET', '../data/avatar/player-reclining3.txt')
      xhr.send()
      break
  }

  xhr.onload = function() {
    if (xhr.status !== 200) {
      console.log(`Avatar display error: ${xhr.status}: ${xhr.statusText}`)
    } else {
      postMessage(xhr.response)
    }
  }
}

