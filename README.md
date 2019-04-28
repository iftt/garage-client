# garage-client [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[travis-image]: https://travis-ci.org/iftt/garage-client.svg?branch=master
[travis-url]: https://travis-ci.org/iftt/garage-client
[npm-image]: https://img.shields.io/npm/v/@iftt/garage-client.svg
[npm-url]: https://npmjs.org/package/@iftt/garage-client
[downloads-image]: https://img.shields.io/npm/dm/@iftt/garage-client.svg
[downloads-url]: https://www.npmjs.com/package/@iftt/garage-client

## About

This is an example implementation of services and devices on the IOTA network using a weather station, FPGA, and a garage door opener. The IOTA network is still a young protocol with a lot of room for interpretation on how to best utilize it. While there have been attempts to market data for financial gain, I believe the more practical application lies in the sale of IoT devices with an ASIC POW chip to talk on the IOTA network effortlessly.

This demo client is essentially a tool to listen to the iota network and make decisions (open/close the garage door) based upon specified instruction sets and inputs that you can find in `test/weatherProgram.json`

## Install
```sh
# yarn
yarn add @iftt/garage-client
# npm
npm i --save @iftt/garage-client
```

## How to use

### Create Environment file
create a file called `.env` with these keys and replacing the variables:
```
API_TOKEN=1234567890
CLIENT_SECRET=TEST9SECRET
CLIENT_TANGLE_SEED=0000JYXUUZVHMCDLNEFA9ZBRM00000PJFLEPMNEFWXOHCTVZWBLCLE9HUOLYLWS9NMJDOKQMOKINXQA
DEVICE_ID=477a5971-3e9d-4eae-98fe-22cb4c153dc1
SERVER=192.168.0.46:3001
GARAGE_OPEN_STATE=1
```

#### How to generate a unique device id secret
```sh
# Linux & OS X
uuidgen
```

#### How to generate a unique IOTA seed
```sh
# Linux
cat /dev/urandom |tr -dc A-Z9|head -c${1:-81}
# OS X
cat /dev/urandom |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1
```

### Create the client

#### Option 1: download this repository and run from the lib
```sh
# clone the repo
git clone https://github.com/iftt/garage-client.git
# install dependences
yarn # or npm install
# run the client
node runGarageClient.js
```

#### Option 2: install the npm package and run
After installing the package, create a JS file and input the following
```js
// ES6
import '@iftt/garage-client'
// ES5
const GarageClient = require('@iftt/garage-client').default

new GarageClient({
  tangleLocation: 'https://nodes.devnet.iota.org',
  fpgaPort: '/dev/ttyUSB1'
})
```

## Modules

These are some of the main modules that make up the IFTT project:

| module | tests | version | description |
|---|---|---|---|
| **[garage-client][garage-client]** | [![][garage-client-ti]][garage-client-tu] | [![][garage-client-ni]][garage-client-nu] | **IFTT Server (this module)**
| [tryte-encode-decode][tryte-encode-decode] | [![][tryte-encode-decode-ti]][tryte-encode-decode-tu] | [![][tryte-encode-decode-ni]][tryte-encode-decode-nu] | data<-->trytes
| [tryte-buffer][tryte-buffer] | [![][tryte-buffer-ti]][tryte-buffer-tu] | [![][tryte-buffer-ni]][tryte-buffer-nu] | json<-->Trytes
| [program-generator][program-generator] | [![][program-generator-ti]][program-generator-tu] | [![][program-generator-ni]][program-generator-nu] | create programs from user defined json
| [icc-fpga-protocol][icc-fpga-protocol] | [![][icc-fpga-protocol-ti]][icc-fpga-protocol-tu] | [![][icc-fpga-protocol-ni]][icc-fpga-protocol-nu] | POW with an fpga device

[garage-client]: https://github.com/iftt/garage-client
[garage-client-ti]: https://travis-ci.org/iftt/garage-client.svg?branch=master
[garage-client-tu]: https://travis-ci.org/iftt/garage-client
[garage-client-ni]: https://img.shields.io/npm/v/@iftt/garage-client.svg
[garage-client-nu]: https://npmjs.org/package/@iftt/garage-client

[tryte-encode-decode]: https://github.com/iftt/tryte-encode-decode
[tryte-encode-decode-ti]: https://travis-ci.org/iftt/tryte-encode-decode.svg?branch=master
[tryte-encode-decode-tu]: https://travis-ci.org/iftt/tryte-encode-decode
[tryte-encode-decode-ni]: https://img.shields.io/npm/v/@iftt/tryte-encode-decode.svg
[tryte-encode-decode-nu]: https://npmjs.org/package/@iftt/tryte-encode-decode

[tryte-buffer]: https://github.com/iftt/tryte-buffer
[tryte-buffer-ti]: https://travis-ci.org/iftt/tryte-buffer.svg?branch=master
[tryte-buffer-tu]: https://travis-ci.org/iftt/tryte-buffer
[tryte-buffer-ni]: https://img.shields.io/npm/v/@iftt/tryte-buffer.svg
[tryte-buffer-nu]: https://npmjs.org/package/@iftt/tryte-buffer

[program-generator]: https://github.com/iftt/program-generator
[program-generator-ti]: https://travis-ci.org/iftt/program-generator.svg?branch=master
[program-generator-tu]: https://travis-ci.org/iftt/program-generator
[program-generator-ni]: https://img.shields.io/npm/v/@iftt/program-generator.svg
[program-generator-nu]: https://npmjs.org/package/@iftt/program-generator

[icc-fpga-protocol]: https://github.com/iftt/icc-fpga-protocol
[icc-fpga-protocol-ti]: https://travis-ci.org/iftt/icc-fpga-protocol.svg?branch=master
[icc-fpga-protocol-tu]: https://travis-ci.org/iftt/icc-fpga-protocol
[icc-fpga-protocol-ni]: https://img.shields.io/npm/v/@iftt/icc-fpga-protocol.svg
[icc-fpga-protocol-nu]: https://npmjs.org/package/@iftt/icc-fpga-protocol


## Debug
If you need to debug this module use the string `garage-client` & `service-manager` (to be modularized)
```sh
DEBUG=garage-client,service-manager,icc-fpga-protocol,tryte-buffer,tryte-encode-decode node x
# or all
DEBUG=* node x
```
---

## ISC License (ISC)

Copyright 2019 <IFTT>
Copyright (c) 2004-2010 by Internet Systems Consortium, Inc. ("ISC")
Copyright (c) 1995-2003 by Internet Software Consortium

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
