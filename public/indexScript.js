// Const

// ------ CANVAS
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

//var windowSize = c.height*c.width;

var c2 = document.getElementById("canvas2");
c2.width = canvas.width;
c2.height = canvas.height;
var ctx2 = c2.getContext("2d");

// ------ AUDIO
var audio = document.getElementById("prout");

// ------ IMG
var img = new Image();
img.src = 'bkg.png';

var img2 = new Image(),
    imgData;
img2.src = 'rose.png';

// ----------------------------------------------------------------------------

function draw() {
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx2.drawImage(img2, 0, 0, canvas.width, canvas.height);
    }
}

draw();

var socket = io.connect('http://localhost:8080');
//var x, y, button;           // readings from the server

//sx=x de l'image source, x=x de la destination
var sensors = [{
    data: '0',
    color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
    centerX: 0,
    centerY: 200,
    radius: 50,
    touches: 'Þ',
    nbRow:2
}, {
    data: '1',
    color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
    centerX: 800,
    centerY: 50,
    radius: 100,
    touches: 'À',
    nbRow:2
}, {
    data: '2',
    color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
    centerX: 500,
    centerY: 150,
    radius: 100,
    touches: '3',
    nbRow:2
}, {
    data: '3',
    color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
    centerX: 250,
    centerY: 400,
    radius: 5,
    touches: '5',
    nbRow:2
}, {
    data: '4',
    color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
    centerX: 300,
    centerY: 500,
    radius: 10,
    touches: '8',
    nbRow:2
}, ];

var nbCell,
    color,
    centerx,
    centery,
    cellWidth = 4,
    pas=0;


$(document).keydown(function(e) {
    var s = String.fromCharCode(e.which);
    console.log(s);
    for (i = 0; i < sensors.length; i++) {
        if (s == sensors[i].touches){
            //radius = sensors[i].radius;
            centerx = sensors[i].centerX;
            centery = sensors[i].centerY;
            color = sensors[i].color[Math.floor((Math.random() * 5) + 1)];
            nbCell = sensors[i].nbRow;
            //console.log("Nom de la touche ="+sensors[i].touches);
            //drawForm();
            drawSquare();
            sensors[i].nbRow += 2;
            pas += 1;
            console.log("nbRow" + nbCell);
        }
    }
});

function drawSquare(){
    for (var row = 0; row < nbCell; row ++){
        for (var column = 0; column < nbCell; column ++){
            // coordinates of the top-left corner
            var x = (centerx - (cellWidth*pas)) + column * 4;
            var y = (centery - (cellWidth*pas)) + row * 4;
            console.log("X " + x + " Y " + y);

            if (row%2 == 0){
                if (column%2 == 0){
                    ctx2.fillStyle = color;
                }
                else {
                    ctx2.fillStyle = "white";
                }
            } else{
                if (column%2 == 0){
                    ctx2.fillStyle = "white";
                }
                else {
                    ctx2.fillStyle = "rgba(0,0,0,0)";
                    console.log(ctx2.fillStyle);
                }
            }
            ctx2.fillRect(x, y, cellWidth, cellWidth);
        }
    }
}

/*
var angStep = 30;
var lastx = null;
var lasty = null;
var lastcpx = null;
var lastcpy = null;
var bezierInt = false;
var x,
    y,
    cpx,
    cpy,
    ang,
    radius,
    centerx,
    centery,
    color;

$(document).keydown(function(e) {
    var s = String.fromCharCode(e.which);
    console.log(s);
    for (i = 0; i < sensors.length; i++) {
        if (s == sensors[i].touches){
            radius = sensors[i].radius;
            centerx = sensors[i].centerX;
            centery = sensors[i].centerY;
            color = sensors[i].color[Math.floor((Math.random() * 5) + 1)];
            //console.log("Nom de la touche ="+sensors[i].touches);
            drawForm();
        }
    }
});

function drawForm() {
    console.log('je suis la');
    ctx2.beginPath();
    var startStep = (Math.random() * 360);
    //var angleStep = 5;
    radius += 0.5;
    for (ang = startStep; ang <= 360 + startStep; ang += angStep) {
        var rad = ang * Math.PI / 180;
        var noise = (Math.random() * 200) + 1;
        x = centerx + (radius * Math.cos(rad));
        y = centery + (radius * Math.sin(rad));
        cpx = centerx + ((radius + noise) * Math.cos(rad));
        cpy = centery + ((radius + noise) * Math.sin(rad));
        cpx2 = centerx + ((radius - (noise / 3)) * Math.cos(rad));
        cpy2 = centery + ((radius - (noise / 3)) * Math.sin(rad));
        if (lastx === null) {
            ctx2.moveTo(x, y);
            bezierInt = true;
        } else if (bezierInt === false) {
            //ctx.lineTo(x,y);
            ctx2.bezierCurveTo(lastcpx, lastcpy, cpx, cpy, x, y);
            bezierInt = true;
        } else if (bezierInt === true) {
            //ctx.lineTo(x,y);
            ctx2.bezierCurveTo(lastcpx2, lastcpy2, cpx2, cpy2, x, y);
            bezierInt = false;
        }
        lastx = x;
        lasty = y;
        lastcpx = cpx;
        lastcpy = cpy;
        lastcpx2 = cpx2;
        lastcpy2 = cpy2;
    }
    //ctx.globalAlpha = Math.random();
    ctx2.globalAlpha = 0.5;
    ctx2.strokeStyle = color;
    var pattern = ctx2.createPattern(img2, "repeat");
    ctx2.fillStyle = pattern;
    console.log(ctx2.strokeStyle);
    ctx2.lineWidth = Math.random() * 5;
    //ctx2.stroke();
    ctx2.fill();
}
*/
/*
// when new data comes in the websocket, read it:
socket.on('sensor', function(data) {
      console.log(data);
      var i = parseFloat(data);
      var radius = sensors[i].radius;
      var centerx = sensors[i].centerX;
      var centery = sensors[i].centerY;
      //console.log(typeof i);
      //console.log(sensors[i].data);
      //ctx.globalCompositeOperation = sensors[i].color;
    function drawForm(){
        ctx2.beginPath();
        var startStep = (Math.random()*360);
        //var angleStep = 5;
        radius += 0.5;
        for(ang = startStep; ang <= 360 + startStep; ang += angStep){
            var rad = ang * Math.PI / 180;
            var noise = (Math.random() * 200)+1;
            x = centerx + (radius * Math.cos(rad));
            y = centery + (radius * Math.sin(rad));
            cpx = centerx + ((radius+noise) * Math.cos(rad));
            cpy = centery + ((radius+noise) * Math.sin(rad));
            cpx2 = centerx + ((radius-(noise/3)) * Math.cos(rad));
            cpy2 = centery + ((radius-(noise/3)) * Math.sin(rad));
            if(lastx === null){
                ctx2.moveTo(x,y);
                bezierInt = true;
            }
            else if (bezierInt === false){
                //ctx.lineTo(x,y);
                ctx2.bezierCurveTo(lastcpx, lastcpy, cpx, cpy, x, y);
                bezierInt = true;
                }
                else if (bezierInt === true) {
                    //ctx.lineTo(x,y);
                    ctx2.bezierCurveTo(lastcpx2, lastcpy2, cpx2, cpy2, x, y);
                    bezierInt = false;
                }
                lastx = x;
                lasty = y;
                lastcpx = cpx;
                lastcpy = cpy;
                lastcpx2 = cpx2;
                lastcpy2 = cpy2;
                }
                //ctx.globalAlpha = Math.random();
                ctx2.globalAlpha = 0.5;
                ctx2.strokeStyle = sensors[i].color[Math.floor((Math.random() * 5)+1)];
                var pattern = ctx2.createPattern(img2, "repeat");
                ctx2.fillStyle = pattern;
                  console.log(ctx2.strokeStyle);
                ctx2.lineWidth = Math.random() * 5;
                //ctx2.stroke();
                ctx2.fill();
                }
                drawForm();

                /*function drawCircle() {
                    var j = Math.floor((Math.random() * 4) + 1);
                    var k = Math.floor((Math.random() * 3) + 1);

                  ctx2.beginPath();
                  var x = (sensors[i].x)+100; // x coordinate
                  var y = (sensors[i].y)+100; // y coordinate
                  var startAngle = 0; // Starting point on circle
                  var endAngle = Math.PI+(Math.PI*k)/2; // End point on circle
                  var anticlockwise = j%2==0 ? false : true; // clockwise or anticlockwise

                  ctx2.arc(x, y, radius, startAngle, endAngle, anticlockwise);

                  if (j>1){
                  ctx2.fillStyle = sensors[i].color;
                    ctx2.fill();
                  } else {
                      ctx2.fillStroke = sensors[i].color;
                    ctx2.stroke();
                  }
                  radius= radius+0.1;
            }
            drawCircle();
});*/
