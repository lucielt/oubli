//SERVER

var express = require('express');
var app = express();
var server = require('http').Server(app);
    server.listen(8080); //port page web http://localhost:8080/
var io = require('socket.io')(server);





var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var SERIAL_PORT = '/dev/cu.usbmodem1411';

var serialPort = new SerialPort(SERIAL_PORT, {
    baudrate: 9600,
    parser: serialport.parsers.readline('\n')
});

//  set up server and socketServer listener functions:
app.use(express.static('public'));					// serve files from the public folder


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
