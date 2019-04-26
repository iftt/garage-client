// @flow
import axios from 'axios'
import ProgramGenerator from '@iftt/program-generator'

const debug = require('debug')('service-manager')

type Service = {
  protocol: { string: { string: any } },
  getRoot: string
}

type Program = {
  condition: Object,
  action: { key: string, value: any }
}

export type Instructions = {
  serviceId: string,
  service: Service,
  program: Program
}

class ServiceManager {
  services: { string: ProgramGenerator }
  action: Function
  runningServices: number
  updateIp: Function
  addService: Function
  constructor (instructions?: null | [Instructions], action: Function) {
    debug('creating ServiceManager')
    const self = this
    self.runningServices = 0
    self.action = action
    self.services = {}
    if (Array.isArray(instructions)) { instructions.forEach(instruction => self.addService(instruction)) }
    self.updateIp = setInterval(self.updateLocation, 1000 * 60 * 15) // update every 15 minutes incase of
    self.updateLocation()
  }

  deconstruct () {
    debug('deconstruct')
    this.clearServices()
    clearInterval(this.updateIp)
  }

  updateLocation () {
    debug('updateLocation')
    // send a ping every 5 min so that the server knows the device's ip
    axios
      .post(`http://${(process.env.SERVER) ? process.env.SERVER : 'localhost'}/login`)
      .then((res) => {
        const token = res.data
        axios
          .post(`http://${(process.env.SERVER) ? process.env.SERVER : 'localhost'}/device/updateDeviceLocation`, {
            token,
            deviceId: process.env.DEVICE_ID
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  getServiceCount () {
    debug('getServiceCount')
    return this.runningServices
  }

  clearServices () {
    debug('clearServices')
    for (let serviceId in this.services) { this.removeServiceById(serviceId) }
  }

  removeServiceById (serviceId: string) {
    debug('removeServiceById')
    this.services[serviceId].deconstruct()
    this.services[serviceId].removeListener('action', this.action)
    delete this.services[serviceId]
    this.runningServices--
  }

  addService (instruction: Instructions) {
    debug('addService')
    this.services[instruction.serviceId] = new ProgramGenerator(instruction)
    this.services[instruction.serviceId].on('action', this.action)
    this.runningServices++
  }
}

export default ServiceManager
