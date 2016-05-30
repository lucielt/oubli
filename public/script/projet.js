var currentCard;
/* -----------------------------------------
CANVAS // RESIZE
*/
function resize() {
    var videoWidth = canvas.width;
    var videoHeight = canvas.height;
    var videoRatio = videoWidth/videoHeight;

    /*var viewWidth = window.innerWidth;
    var viewHeight = window.innerHeight;*/
    var viewWidth = $( '.canvas-subwrapper' ).width();
    var viewHeight = $( '.canvas-subwrapper' ).height();
    var viewRatio = viewWidth/viewHeight;

    var width = 0,
        height = 0,
        top = 0,
        left = 0;
        width = viewWidth;
        height = viewWidth / videoRatio;
        left = 0;
        top = -((height - viewHeight)/2);

        width = Math.round(width);
        height = Math.round(height);
    var x = Math.round(left);
    var y = Math.round(top);

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    //canvas.style.top = y + 'px';
    canvas.style.left = x + 'px';

    canvas2.style.width = width + 'px';
    canvas2.style.height = height + 'px';
    canvas2.style.left = x + 'px';
    canvas3.style.width = width + 'px';
    canvas3.style.height = height + 'px';
    canvas3.style.left = x + 'px';
    $( '.canvas-subwrapper' ).css("height", canvas.style.height);
}
window.onresize = resize;

/* -----------------------------------------
----------------------------------------- */

// ------ CANVAS
var canvas = document.getElementById("canvas");
canvas.width = 576;
canvas.height = 384;
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById("canvas2");
canvas2.width = canvas.width;
canvas2.height = canvas.height;
var ctx2 = canvas2.getContext("2d");

var canvas3 = document.getElementById("canvas3");
canvas3.width = canvas.width;
canvas3.height = canvas.height;
var ctx3 = canvas3.getContext("2d");
var img, img2, cardKeyboardEnabled = false;
function drawImage()
{
    // ------ IMG
    img = document.createElement('img');
    img.onload = function() {
        resize();
        ctx.fillStyle = "white";
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        img2.src = currentCard.image;
    };
    img.src = currentCard.bckg;

    img2 = document.createElement('img');
    img2.onload = function() {
        ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
    };

    var audio = document.getElementById("prout");

}

var socket = io.connect('http://localhost:8080');

/*var nbCell,
    color,
    centerx,
    centery,
    cellWidth = 4,
    pas=0;*/

var pas,
    pas2,
    nbCell,
    cellWidth = 4,
    color,
    xInit,
    yInit,
    pointXinit,
    pointYinit,
    pointX,
    pointY;

    var decalagePointX = (window.innerWidth - canvas.width) / 2,
    decalagePointY = (window.innerHeight - canvas.height) / 2,
    width,
    height,
    xDraw = xInit - (width / 2),
    yDraw = yInit - (height / 2);

var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

/**
 * Expérience - Ce qu'il se passe quand signal de la carte est reçu
 */
$(document).keydown(function(e)
{
    if (!cardKeyboardEnabled)
    {
        return
    }
    var s = String.fromCharCode(e.which);
    //console.log(s);
    //delay(function(){
    var sensors = currentCard.sensors;
    for (i = 0; i < sensors.length; i++)
    {
        if (s !== sensors[i].touches)
        {
            continue;
        }
        //drawSquare();
        //radius = sensors[i].radius;
        xInit = sensors[i].centerX;
        yInit = sensors[i].centerY;
        width = sensors[i].width;
        height = sensors[i].height;
        pas = sensors[i].pas;
        pointXinit = sensors[i].pointX[0];
        pointYinit = sensors[i].pointY[0];
        pointX = sensors[i].pointX;
        pointY = sensors[i].pointY;
        color = getRandomColor();
        //color = sensors[i].color[Math.floor((Math.random() * 5) + 1)];
        //console.log("Nom de la touche ="+sensors[i].touches);
        //drawForm();
        /*drawSquare();
        sensors[i].nbRow += 2;
        pas2 += 1;
        nbCell = sensors[i].nbRow;
        console.log("nbRow" + nbCell);*/
        //xInit = window.innerWidth / 2;
        //yInit = window.innerHeight / 2;
        xDraw = xInit - (width / 2);
        yDraw = yInit - (height / 2);
        drawColors();
        sensors[i].pas = pas * Math.pow(0.9, (1 / 16) * pas);
        sensors[i].width += 0.5;
        sensors[i].height += 0.5;
        xDraw = xInit - (width / 2);
        yDraw = yInit - (height / 2);
        //console.log("xDraw", xDraw ,"yDraw", yDraw);
        //draw();
        ctx3.drawImage(canvas, 0, 0);
        ctx3.drawImage(canvas2, 0, 0);
    }
        //}, 1000 );

});
/**
 * Function exécutée lors de l'appuit sur le boutton info
 */
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
            if (Math.pow((x + xDraw) - xInit, 2) + Math.pow((y + yDraw) - yInit, 2) < Math.pow((width / 2), 2)) {
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
    ctx2.save();
    ctx2.beginPath();
    ctx2.arc(xInit, yInit, width / 2, 0, 2 * Math.PI);
    /*ctx2.moveTo(pointXinit, pointYinit);
    for (j=1; j< pointXinit.length; j++){
        ctx2.lineTo(pointXinit[j], pointYinit[j]);
    }*/
    ctx2.closePath();
    ctx2.clip();
    ctx2.drawImage(img2, 0, 0, canvas2.width, canvas2.height);
    ctx2.restore();
    //ctx2.globalCompositeOperation = "screen";
    ctx2.globalCompositeOperation = "overlay";
    ctx2.shadowBlur = 5;
    ctx2.shadowColor = "rgba(200,200,200,100)";
    ctx2.fillStyle = color;
    ctx2.beginPath();
    ctx2.arc(xInit, yInit, width / 2, 0, 2 * Math.PI);
    /*ctx2.moveTo(pointXinit, pointYinit);
    for (j=1; j< pointX.length; j++){
        ctx2.lineTo(pointX[j], pointY[j]);
    }*/
    ctx2.closePath();
    /*ctx2.beginPath();
    ctx2.arc(xInit, yInit, width/2, 0, 2 * Math.PI);
    ctx2.closePath();*/
    ctx2.fill();
    xDraw = xInit - (width / 2);
    yDraw = yInit - (height / 2);
    /*var imgPointX = [0, 110, 142, 165, 171, 125, 106, 218, 234, 273, 285, 285, 256, 223, 200, 183, 177, 186, 165, 221, 201, 186, 189, 225, 265, 285, 336, 340, 400, 451, 502, 576, 576, 534, 497, 462, 440, 393, 374, 352, 346, 350, 360, 355, 441, 441, 448, 433, 458, 464, 472, 482, 523, 538, 576, 336, 336, 325, 322, 301, 301, 246, 219, 215, 191, 167, 145, 133, 125, 134, 141, 134, 138, 134, 129, 126, 108, 91, 88, 84, 77, 0];
    var imgPointY = [0, 0, 42, 67, 85, 131, 174, 160, 158, 138, 115, 83, 99, 98, 87, 71, 49, 40, 0, 0, 33, 51, 68, 91, 87, 74, 55, 114, 183, 190, 158, 154, 200, 171, 175, 197, 200, 192, 185, 205, 258, 292, 321, 339, 214, 206, 210, 288, 318, 317, 338, 336, 373, 373, 384, 384, 351, 337, 324, 306, 299, 274, 294, 303, 299, 294, 307, 310, 318, 329, 339, 352, 384, 384, 374, 329, 326, 300, 263, 253, 217, 164];
*/
    var imgPointX = currentCard.imgPointX;
    var imgPointY = currentCard.imgPointY;
    var long = imgPointX.length;
    ctx2.save();
    ctx2.globalCompositeOperation = "normal";
    ctx2.beginPath();
    ctx2.moveTo(imgPointX[0], imgPointY[0]);
    for (j = 1; j < long; j++) {
        ctx2.lineTo(imgPointX[j], imgPointY[j]);
        //console.log("jesuisla", imgPointX[j], imgPointY[j]);
    }
    //ctx3.closePath();
    ctx2.clip();
    ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
    ctx2.drawImage(img2, 0, 0, canvas2.width, canvas2.height);
    ctx2.restore();
}

$(function()
{
    $('.identifyUser').on('submit',function(e){
        e.preventDefault();

        var $form = $(e.currentTarget);
        var id = $form.find('input[name=idUser]').val();
        //alert(id);
        console.log(id);
        //delay(function(){
        for (j = 0; j < cards.length; j++) {
            console.log(cards.lenght);
            if (id == cards[j].idInit) {
                $('.identify').css('display', "none");
                $('.canvas-subwrapper').css('display', "block");
                currentCard = cards[j];
                drawImage();
                cardKeyboardEnabled = true;

            } else {
                $(':input', '.identifyUser').val('');
            }
        }

    });

    /**
     * Function exécutée lors de l'appuit sur le boutton info
     */
    $('#info-button').on('click', function() {
        cardKeyboardEnabled = false;
        $('#info-button a').disable(true);
        $('#canvas-info').show();
        $('#capture-button-div').hide();
        $('.canvas-line').css("background-color", "transparent");
        $('#info-button-div .close.heavy, .vertical_info').addClass('changed');
    });

    /**
     * Function exécutée lors de l'appuit sur le boutton capture
     */
    $('#capture-button').on('click', function() {
        cardKeyboardEnabled = false;
        $(':input', '#message-form').not(':submit').val('');
        /*console.log("Je suis egal a "+$('#message-form input:hidden').val());*/
        var dataURL = canvas.toDataURL('image/png');
        $('#message-form form input[name=image]').val(dataURL);
        $('#canvas-capture, #message-form').show();
        $('#info-button-div, #message-save, .camera-icon').hide();
        $('.canvas-line').css("background-color", "transparent");
        $('#capture-button-div .close.heavy, .vertical_capture').addClass('changed');
        $('#capture-button a').disable(true);
        //$('#message-form').show();
        //$('#message-save').hide();

    });

    /**
     * Reset pour les bouttons info et capture
     */
    $('.close').on('click', function() {
        cardKeyboardEnabled = true;
        $('#canvas-info, #canvas-capture').hide();
        //$('#canvas-capture').hide();
        $('#info-button-div, #capture-button-div, .camera-icon').show();
        //$('#capture-button-div').show();
        $('.canvas-line').css("background-color", "#2e2e2e");
        $('#capture-button-div .close.heavy, #info-button-div .close.heavy, .vertical_capture, .vertical_info').removeClass('changed');
        $('#capture-button a, #info-button a').disable(false);
        //$('#info-button a').disable(false);
    });

    /**
     * Formulaire pour la capture du canvas pendant l'expérience
     */
    $('#message-form form').on('submit', function(e) {
        $('#message-form').hide();
        $('#message-save').show();
        e.preventDefault();
        var $form = $(e.currentTarget);
        var url = $form.attr('action');

        if (!$form.find('input[name=name]').val().length) {
            alert('vide');
            return;
        }

        var data = {};
        $.each($form.serializeArray(), function(key, value) {
            data[value.name] = value.value;
            //console.log(data[value.name]);
        });
        $.post(url, data, function(data) {
            console.log(data.url);
        }, 'json');
    });
});
