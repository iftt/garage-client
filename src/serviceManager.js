// @flow
import axios            from 'axios';
import ProgramGenerator from '@iftt/program-generator';

export type Instructions = {
  serviceId: string,
  service: Service,
  program: Program
};

type Service = {
  protocol: { string: { string: any } },
  getRoot: string
};

type Program = {
  condition: Object,
  action: { key: string, value: any }
};

class ServiceManager {
  services: { string: ProgramGenerator };
  action: Function;
  runningServices: number;
  updateIp: setInterval;
  constructor(instructions: [Instructions], action: Function) {
    const self = this;
    self.runningServices = 0;
    self.action = action;
    self.services = {};
    if (Array.isArray(instructions))
      instructions.forEach(instruction => self.addService(instruction));
    self.updateIp = setInterval(self.updateLocation, 1000 * 60 * 15); // update every 15 minutes incase of
    self.updateLocation();
  }

  deconstruct() {
    this.clearServices();
    clearInterval(self.updateIp);
  }

  updateLocation() {
    // send a ping every 5 min so that the server knows the device's ip
    axios
      .post(`http://${process.env.SERVER}/login`)
      .then((res) => {
        const token = res.data;
        axios
          .post(`http://${process.env.SERVER}/device/updateDeviceLocation`, {
            token,
            deviceId: process.env.DEVICE_ID
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getServiceCount() {
    return this.runningServices;
  }

  clearServices() {
    for (let serviceId in this.services)
      this.removeServiceById(serviceId);
  }

  removeServiceById(serviceId: string) {
    this.services[serviceId].deconstruct();
    this.services[serviceId].removeListener('action', this.action);
    delete this.services[serviceId];
    this.runningServices--;
  }

  addService(instruction: Instructions) {
    this.services[instruction.serviceId] = new ProgramGenerator(instruction);
    this.services[instruction.serviceId].on('action', this.action);
    this.runningServices++;
  }
}

export default ServiceManager;
