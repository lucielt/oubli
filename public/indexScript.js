// Const

// ------ CANVAS
var canvas = document.getElementById("canvas");
canvas.width = 576;
canvas.height = 384;
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById("canvas2");
canvas2.width = canvas.width;
canvas2.height = canvas.height;
var ctx2 = canvas2.getContext("2d");

// ------ IMG
var img = new Image();
img.src = 'bkg.png';

var img2 = new Image();
img2.src = 'rose.png';

var img3 = new Image(),
    imgData;
img3.src = 'telechargement.png';

// ------ AUDIO
var audio = document.getElementById("prout");

// ----------------------------------------------------------------------------

function draw() {
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
    }
}
draw();

var socket = io.connect('http://localhost:8080');
//var x, y, button;           // readings from the server

//sx=x de l'image source, x=x de la destination
var sensors = [{
    data: '0',
    color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
    centerX: (canvas2.width / 2)-200,
    centerY: canvas2.height / 2,
    width: 10,
    height: 10,
    pas : 20,
    radius: 50,
    touches: 'Þ',
    nbRow:2
}, {
    data: '1',
    color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
    centerX: (canvas2.width / 2)+200,
    centerY: canvas2.height / 2,
    width: 10,
    height: 10,
    pas : 20,
    radius: 100,
    touches: 'À',
    nbRow:2
}, {
    data: '2',
    color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
    centerX: canvas2.width / 2,
    centerY: canvas2.height / 2,
    width: 10,
    height: 10,
    pas : 30,
    radius: 100,
    touches: '3',
    nbRow:2
}, {
    data: '3',
    color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
    centerX: canvas2.width / 2,
    centerY: (canvas2.height / 2)-200,
    width: 10,
    height: 10,
    pas : 40,
    radius: 5,
    touches: '5',
    nbRow:2
}, {
    data: '4',
    color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
    centerX: canvas2.width / 2,
    centerY: (canvas2.height / 2)+200,
    width: 10,
    height: 10,
    pas : 50,
    radius: 10,
    touches: '8',
    nbRow:2
}, ];

/*var nbCell,
    color,
    centerx,
    centery,
    cellWidth = 4,
    pas=0;*/
    var pas,
        color,
        xInit,
        yInit,
        width,
        height,
        xDraw = xInit-(width/2),
        yDraw = yInit-(height/2);
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();
$(document).keydown(function(e) {
    var s = String.fromCharCode(e.which);
    console.log(s);
    //delay(function(){
        for (i = 0; i < sensors.length; i++) {
            if (s == sensors[i].touches){
                //radius = sensors[i].radius;
                xInit = sensors[i].centerX;
                yInit = sensors[i].centerY;
                width = sensors[i].width;
                height = sensors[i].height;
                pas = sensors[i].pas;
                color = getRandomColor();
                //color = sensors[i].color[Math.floor((Math.random() * 5) + 1)];
                /*nbCell = sensors[i].nbRow;
                //console.log("Nom de la touche ="+sensors[i].touches);
                //drawForm();
                drawSquare();
                sensors[i].nbRow += 2;
                pas += 1;
                console.log("nbRow" + nbCell);*/
                //xInit = window.innerWidth / 2;
                //yInit = window.innerHeight / 2;
                xDraw = xInit-(width/2);
                yDraw = yInit-(height/2);
                drawColors();
                sensors[i].pas = pas * Math.pow(0.9, (1 / 16) * pas);
                sensors[i].width += 0.5;
                sensors[i].height += 0.5;
                xDraw = xInit-(width/2);
                yDraw = yInit-(height/2);
                console.log("xDraw", xDraw ,"yDraw", yDraw);
            }
        }
    //}, 1000 );
});
function drawColors() {
    imageData = ctx2.createImageData(width, height);
    //pos = 0; // index position into imagedata array
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            index = (x + (y * imageData.width)) * 4;
            // calculate sine based on distance
            /*x2 = x;
            y2 = y;*/
            d = Math.sqrt(Math.pow(x, 3) + Math.pow(y, 3));
            t = Math.sin(d / pas);
            // calculate RGB values based on sine
            r = 105 + t * (Math.floor(Math.random() * 255));
            g = 103 + t * (Math.floor(Math.random() * 255));
            b = 100 + t * (Math.floor(Math.random() * 255));
            if(Math.pow((x+xDraw) - xInit, 2) + Math.pow((y+yDraw) - yInit, 2) < Math.pow((width/2),2)){
                imageData.data[index + 3] = 255;
            } else {
                imageData.data[index + 3] = 0;
            }
            imageData.data[index + 0] = r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b + 50;
            //imageData.data[index + 3] = a;
        }
    }
    imageData = ctx2.putImageData(imageData, xDraw, yDraw);
    ctx2.globalCompositeOperation = "overlay";
    ctx2.save();
    ctx2.beginPath();
    ctx2.arc(xInit, yInit, width/2, 0, 2 * Math.PI);
    ctx2.closePath();
    ctx2.clip();
    ctx2.drawImage(img2, 0, 0, canvas2.width, canvas2.height);
    ctx2.restore();
    //ctx2.globalCompositeOperation = "screen";
    ctx2.shadowBlur=5;
    ctx2.shadowColor="rgba(200,200,200,100)";
    ctx2.fillStyle = color;
    ctx2.beginPath();
    ctx2.arc(xInit, yInit, width/2, 0, 2 * Math.PI);
    ctx2.closePath();
    ctx2.fill();
    xDraw = xInit-(width/2);
    yDraw = yInit-(height/2);
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
/*
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
}*/
