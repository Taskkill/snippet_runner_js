const getWorkerURL = script => window.URL.createObjectURL(createTextFile(script))

const createTextFile = content => new Blob([content], {
  type: 'text/plain',
})

const code = `
self.onconnect = event => {
  const port = event.ports[0]

  port.onmessage = message => {
    const is_mutex = message.data instanceof Int32Array

    if (is_mutex) {
      const mutex = message.data
      Atomics.wait(message.data, 0, 0)
      console.log('woke')
    }


    port.postMessage('end of worker ' + message.data)

  }
}


`
const mutex = new Int32Array(new SharedArrayBuffer(4))

const worker = new SharedWorker(getWorkerURL(code))


worker.port.onmessage = message => {
  console.log(message)
}


worker.port.postMessage(mutex)

// setTimeout(() => {
//   Atomics.wake(mutex, 0)
// }, 3000)
