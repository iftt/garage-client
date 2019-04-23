# garage-client [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[travis-image]: https://travis-ci.org/iftt/garage-client.svg?branch=master
[travis-url]: https://travis-ci.org/iftt/garage-client
[npm-image]: https://img.shields.io/npm/v/@iftt/garage-client.svg
[npm-url]: https://npmjs.org/package/@iftt/garage-client
[downloads-image]: https://img.shields.io/npm/dm/@iftt/garage-client.svg
[downloads-url]: https://www.npmjs.com/package/@iftt/garage-client

## About


## Debug
If you need to debug this module use the string `garage-client` & `service-manager` (to be modularized)
```sh
DEBUG=garage-client,service-manager node x
```

## Useful commands

### Create a Tangle Seed
```sh
# Linux
cat /dev/urandom |tr -dc A-Z9|head -c${1:-81}
# OS X
cat /dev/urandom |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1
```

---

## ISC License (ISC)

Copyright 2019 <IFTT>
Copyright (c) 2004-2010 by Internet Systems Consortium, Inc. ("ISC")
Copyright (c) 1995-2003 by Internet Software Consortium

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
