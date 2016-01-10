// Const

// ------ CANVAS
var canvas = document.getElementById("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

    //var windowSize = c.height*c.width;

var c2 = document.getElementById("canvas2");
c2.width  = canvas.width;
c2.height = canvas.height;
var ctx2 = c2.getContext("2d");

// ------ AUDIO
var audio = document.getElementById("prout");

// ------ IMG
var img = new Image();
    img.src = 'bkg.png';

var img2 = new Image(), imgData;
    img2.src = 'rose.png';

// ----------------------------------------------------------------------------

function draw(){
  img.onload = function(){
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx2.drawImage(img2, 0, 0, canvas.width, canvas.height);
    }
}

draw();

var socket = io.connect('http://localhost:8080');
//var x, y, button;           // readings from the server

var sensors = [
  {
    data:'0',
    sX: 0,
    sY: 200,
    sWidth: 100,
    sHeight: 500,
    x: 300,
    y: 0,
    width: 500,
    height: 600,
  },
  {
    data:'1',
    sX: 800,
    sY: 50,
    sWidth: 500,
    sHeight: 500,
    x: (canvas.width)-500,
    y: 0,
    width: 800,
    height: 300,
  },
  {
    data:'2',
    sX: 500,
    sY: 150,
    sWidth: 150,
    sHeight: 40,
    x: (canvas.width)-300,
    y: (canvas.height)-300,
    width: 300,
    height: 200,
  },
  {
    data:'3',
    sX: 250,
    sY: 400,
    sWidth: 100,
    sHeight: 250,
    x: 0,
    y: (canvas.height)-400,
    width: 200,
    height: 400,
  },
  {
    data:'4',
    sX: 300,
    sY: 500,
    sWidth: 10,
    sHeight: 20,
    x: 0,
    y: 50,
    width: 250,
    height: 200,
  },
];



// when new data comes in the websocket, read it:
socket.on('sensor', function(data) {
      console.log(data);
      var i = parseFloat(data);
      //console.log(typeof i);
      //console.log(sensors[i].data);
      //ctx.globalCompositeOperation = sensors[i].color;
      console.log('opacity='+sensors[i].color);
      console.log('x='+sensors[i].sX);
      console.log('y='+sensors[i].sY);
      function zoom() {
          console.log('je suis la');
          ctx2.drawImage(canvas,
                            Math.abs(sensors[i].sX - 5),
                            Math.abs(sensors[i].sY - 5),
                            sensors[i].sWidth, sensors[i].sHeight,
                            sensors[i].x, sensors[i].y,
                            sensors[i].width, sensors[i].height);
        }
      zoom();
});
