onmessage = function(msg) {
  var xhr = new XMLHttpRequest();

  switch (msg.data) {
    case 'standing':
      xhr.open('GET', '/assets/data/player-standing.txt')
      xhr.send()
      break
    case 'standing-blink':
      xhr.open('GET', '/assets/data/player-standing-blink.txt')
      xhr.send()
      break
    case 'sitting':
      xhr.open('GET', '/assets/data/player-sitting.txt')
      xhr.send()
      break
    case 'sitting-blink':
      xhr.open('GET', '/assets/data/player-sitting-blink.txt')
      xhr.send()
      break
    case 'reclining1':
      xhr.open('GET', '/assets/data/player-reclining1.txt')
      xhr.send()
      break
    case 'reclining2':
      xhr.open('GET', '/assets/data/player-reclining2.txt')
      xhr.send()
      break
    case 'reclining3':
      xhr.open('GET', '/assets/data/player-reclining3.txt')
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

