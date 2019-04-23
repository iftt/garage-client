// @flow
import SocketIO from 'socket.io'
import NedDB from 'nedb'
import Queue from 'queue'
import { Gpio } from 'onoff' // https://www.npmjs.com/package/onoff#writesyncvalue & https://pinout.xyz/pinout/pin13_gpio27
import * as Mam from '@iftt/mam' // https://devnet.thetangle.org/mam/
import TryteBuffer from '@iftt/tryte-buffer'
import FpgaProtocol from './fpgaProtocol'
import garageProtocol from './garageProtocol.json'
import ServiceManager from './serviceManager'

import type { Instructions } from './serviceManager'

require('dotenv').config() // .env variables

type Options = {
  allowedOrigins: [string], // this is for talking with the web, you probably only want to allow your server
  tangleLocation: string,
  fpgaPort: string
}

class GarageClient extends FpgaProtocol {
  socket: SocketIO
  nedDB: NedDB
  reedSwitch: Gpio
  garageOpenerCloser: Gpio
  switchStatus: number
  provider: string
  mamState: Mam
  minWeightMagnitude: number
  serviceManager: ServiceManager
  garageProtocol: TryteBuffer
  jobQueue: Queue
  _onPortOpen: Function
  constructor (options: Options) {
    super(options.fpgaPort)
    // server
    let origins = (options.allowedOrigins) ? options.allowedOrigins : (process.env.ORIGINS) ? process.env.ORIGINS : ['*']
    if (typeof origins === 'string') { origins = origins.split(',') }
    this.socket = new SocketIO(8001, { origins })
    this.setupIO()
    this.nedDB = new NedDB({ filename: './client.db', autoload: true })
    // pi GPIO prep
    this.reedSwitch = new Gpio(22, 'in', 'both', { debounceTimeout: 1250 }) // add 1 second-ish 'debounce' timer to remove an anomolies as reed switch activates. Time is not really a huge deal here, so we should be safe rather then sorry.
    this.garageOpenerCloser = new Gpio(27, 'out')
    this.switchStatus = this.reedSwitch.readSync()
    // iota tangle
    this.provider = (!options.tangleLocation) ? 'https://nodes.devnet.iota.org' : options.tangleLocation
    this.setupMaM()
    // Get active service(s) from db if it/they exist
    this.nedDB.findOne({ key: 'services' }, (err, doc) => {
      if (!err && doc) {
        let instructions: [Instructions] = doc.services
        this.serviceManager = new ServiceManager(instructions, this._actions.bind(this))
      }
    })
    this.garageProtocol = new TryteBuffer(garageProtocol)
    // MaM attach queue handler
    this.jobQueue = Queue({ concurrency: 1, timeout: 1000 * 25, autostart: true }) // if the mam isn't posted in 25 seconds, give up. Only allow one job at a time and auto run them
  }

  deconstruct () {
    this.socket.close()
  }

  _actions (action: { key: string, value: any }) {
    // this device only has "date" and "garageDoor", thus we only have to worry about "garageDoor"
    let changeGarageState = false
    if (action.key === 'garageDoor') {
      if (action.value === 1 && this.switchStatus === parseInt(process.env.GARAGE_OPEN_STATE)) { // we want the garage to be closed
        changeGarageState = true
      } else if (action.value === 0 && this.switchStatus !== parseInt(process.env.GARAGE_OPEN_STATE)) { // we want the garage to be open
        changeGarageState = true
      }
    }
    if (action.key === 'garageDoor' && changeGarageState) { this.openCloseGarage() }
  }

  program (instructions: [Instructions]) {
    const self = this
    self.serviceManager.clearServices()
    if (Array.isArray(instructions)) {
      instructions.forEach((instruction: Instructions) => self.serviceManager.addService(instruction))
    }
    self.nedDB.update({ key: 'services' }, { key: 'services', services: instructions }, { upsert: true })
  }

  setupIO () {
    const self = this
    self.socket.on('connection', (socket) => {
      socket.emit('ready', { id: socket.id, clientId: process.env.DEVICE_ID })
      socket.on('program', self.program.bind(self))
    })
  }

  setupMaM () {
    const self = this
    if (this.provider === 'https://nodes.devnet.iota.org') {
      self.minWeightMagnitude = 9 // testnet difficulty
    } else {
      self.minWeightMagnitude = 14
    }
    self.mamState = Mam.init({
      provider: self.provider,
      attachToTangle: self.attachToTangle.bind(self) // we are using the fpga prepared attachment :D
    }, process.env.CLIENT_TANGLE_SEED, 2)
    self.nedDB.findOne({ key: 'mamstate' }, (err, doc) => {
      if (!err && doc) {
        self.mamState = doc.state
      } else {
        self.mamState = Mam.changeMode(self.mamState, 'public')
      }
    })
  }

  _onPortOpen () { // called when fpga device is ready...
    console.log('fpga device is ready')
    this._watchGarageDoor()
  }

  openCloseGarage () {
    const self = this
    self.garageOpenerCloser.writeSync(1)
    setTimeout(() => {
      self.garageOpenerCloser.writeSync(0)
    }, 750)
  }

  getRoot () {
    return this.mamState.channel.next_root
  }

  _watchGarageDoor () {
    const self = this
    self.reedSwitch.watch((err: null | string, status: number) => {
      if (err) { console.log(err) } else if (status !== self.switchStatus) { // watch randomly returns values outside of true changes, and thus can be the same value
        self.switchStatus = status
        if (status === process.env.GARAGE_OPEN_STATE) { self.onGarageOpen() } else { self.onGarageClose() }
      }
    })
  }

  onGarageOpen () {
    const self = this
    self.jobQueue.push(function () { self._publish(false, new Date()) })
  }

  onGarageClose () {
    const self = this
    self.jobQueue.push(function () { self._publish(true, new Date()) })
  }

  async _publish (garageDoor: boolean, date: Date) {
    const self = this
    try {
      const trytes = self.garageProtocol.encode({
        date,
        garageDoor
      })
      const message = Mam.create(self.mamState, trytes)
      await Mam.attach(message.payload, message.address, 3, self.minWeightMagnitude)
      // update and store the state
      self.mamState = message.state
      this.nedDB.update({ key: 'mamstate' }, { key: 'mamstate', state: self.mamState }, { upsert: true })
      console.log('Client Root:', message.root)
    } catch (err) {}
  }
}

export default GarageClient
