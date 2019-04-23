// @flow
import SerialPort from 'serialport'
import EventEmitter from 'events'

class FpgaProtocol extends EventEmitter {
  port: SerialPort
  tryteBuffer: Buffer
  constructor (portLocation: string, baudRate: number = 115200) {
    super()
    this.port = new SerialPort(portLocation, { baudRate })
    this.port.on('open', () => {
      this._onPortOpen()
    })
    this.tryteBuffer = Buffer.from('')
    this.port.on('data', (data) => {
      this.tryteBuffer = Buffer.concat([this.tryteBuffer, data])
      if (data[data.length - 1] === 10) {
        let res = JSON.parse(this.tryteBuffer.toString('utf8').trim())
        this.emit('data', res)
        this.tryteBuffer = Buffer.from('')
      }
    })
  }

  _onPortOpen () {}

  attachToTangle (trunkTransaction: string, branchTransaction: string, minWeightMagnitude: number, trytes: [string], callback: Function): Promise<string> {
    const self = this
    return new Promise((resolve, reject) => {
      try { // several errors that COULD occur and would crash the app.. so lets be safe rather then sorry
        let timer = setTimeout(() => {
          let err = new Error('ran out of time')
          if (callback) { callback(err) }
          reject(err)
        }, 15000) // 15 seconds
        let bytestream = Buffer.from(JSON.stringify({
          command: 'attachToTangle',
          trunkTransaction,
          branchTransaction,
          minWeightMagnitude,
          timestamp: new Date().getTime(),
          trytes
        }) + '\r')
        this.once('data', (response) => {
          clearTimeout(timer)
          if (callback) { callback(null, response.trytes) }
          resolve(response.trytes)
        })
        self.port.write(bytestream)
      } catch (err) {
        // res(null); // empty tryte set
        if (callback) { callback(err) }
        reject(err)
      }
    })
  }
}

export default FpgaProtocol
