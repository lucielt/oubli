// ------ CANVAS
var canvas = document.getElementById("canvasGlitch");
canvas.width = 576;
canvas.height = 384;
var contextGlitch = canvas.getContext("2d");


// ----------------------------------------------------------------------------



function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}
var width  = 576,
    height = 576,
    pas = 20,
    xInit = 0,
    yInit = 0;

function drawColors(){
    requestAnimationFrame(drawColors);

    imageData = contextGlitch.createImageData(width, height);
    indexNb = width * height;
    pos =0;

    for (x = 0; x < width; x++) {
    	for (y = 0; y < height; y++) {
            x2 = x;
    		y2 = y ;

            d = Math.sqrt(Math.pow(x2, 3) + Math.pow(y2, 3));
            t = Math.sin(d/pas);
            r = 105 + t * (Math.floor(Math.random() * 255));
            g = 103 + t * (Math.floor(Math.random() * 255));
            b = 100 + t * (Math.floor(Math.random() * 255));
            imageData.data[pos++] = r;
    		imageData.data[pos++] = g;
    		imageData.data[pos++] = b+50;
    		imageData.data[pos++] = 200; // opaque alpha
    	}
    }
     imageData = contextGlitch.putImageData(imageData,xInit, yInit);

    if (pas > 10) {
        pas = pas * Math.pow(0.9, (1/16)*pas);

    } else {
        pas = 20;
    }

}

function init() {
    drawColors();
}

init();
