const weatherProtocol = require('./src/weatherProtocol.json');

const TryteBuffer = require('@iftt/tryte-buffer').default;
const tryteBuffer = new TryteBuffer(weatherProtocol);

const decodedTrytes = tryteBuffer.decode('D9HNHSIMLLGQNPM9KZU99CD999I999V99BO99MND9HNHSI999L999Q999Q999Q999Q99999DI9DBT9DBQCK99XUAT999999999GF99MN9DSK');

console.log(decodedTrytes);
