
var server = require('./server');
var io = server.io;

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var SERIAL_PORT = '/dev/cu.usbmodem1411';

var serialPort = new SerialPort(SERIAL_PORT, {
    baudrate: 9600,
    parser: serialport.parsers.readline('\n')
});

// this function runs if there's input from the serialport:
serialPort.on('open', function () {
    console.log('serialport open');
    serialPort.on('data', function(data)
    {
      data = ''+data;
      console.log(data);
      io.emit('sensor', data);
    });
});
