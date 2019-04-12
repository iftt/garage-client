// @flow
import SerialPort from 'serialport';
import EventEmitter from 'events';

class FpgaProtocol extends EventEmitter {
  port: SerialPort
  constructor(portLocation: string, baudRate: number = 115200) {
    super();
    this.port = new SerialPort(portLocation, { baudRate });
    this.port.on('open', () => {
      this._onPortOpen();
    });
    this.tryteBuffer = new Buffer.from('');
    this.port.on('data', (data) => {
      this.tryteBuffer = Buffer.concat([this.tryteBuffer, data]);
      if (data[data.length - 1] === 10) {
        let res = JSON.parse(this.tryteBuffer.toString('utf8').trim());
        this.emit('data', res);
        this.tryteBuffer = new Buffer.from('');
      }
    });
  }

  attachToTangle(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) {
    const self = this;
    return new Promise(res => {
      try { // several errors that COULD occur and would crash the app.. so lets be safe rather then sorry
        let timer = setTimeout(() => {
          if (callback)
            callback('ran out of time');
          rej('ran out of time');
          // res(null); // empty tryte set
        }, 15000); // 15 seconds
        let bytestream = new Buffer.from(JSON.stringify({
          command: 'attachToTangle',
          trunkTransaction,
          branchTransaction,
          minWeightMagnitude,
          timestamp: new Date().getTime(),
          trytes
        }) + '\r');
        this.once('data', (response) => {
          clearTimeout(timer);
          if (callback)
            callback(null, response.trytes);
          res(response.trytes);
        });
        self.port.write(bytestream);
      } catch (err) {
        // res(null); // empty tryte set
        if (callback)
          callback(err);
        rej(err);
      }
    });
  }
}

export default FpgaProtocol;
