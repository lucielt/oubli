var currentCard;

var UPDATE_SENSOR_THROTTLE_DELAY = 100;
var SAVE_SNAPSHOT_THROTTLE_DELAY = 5000;
var GLITCH_DELAY = 10000;
var AUDIO_SENSORGLITCH_DELAY = 500;

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
var contextMask = canvas.getContext("2d");

var canvas2 = document.getElementById("canvas2");
canvas2.width = canvas.width;
canvas2.height = canvas.height;
var contextBackground = canvas2.getContext("2d");

var canvas3 = document.getElementById("canvas3");
canvas3.width = canvas.width;
canvas3.height = canvas.height;
var contextRender = canvas3.getContext("2d");

var img, img2, img_Masque, cardKeyboardEnabled = false;

var audio_ambiance = document.getElementById("audio_ambiance");
var audio_sensorGlitch = document.getElementById("audio_sensorGlitch");
var audio_bckgGlitch = document.getElementById("audio_bckgGlitch");

function drawImage()
{
    audio_ambiance.src = currentCard.sound;
    audio_ambiance.addEventListener('canplaythrough', function() {
        audio_ambiance.loop = true;
        audio_ambiance.volume = 0.5;
        audio_ambiance.play();
    }, false);
    //S'il y a un snapshot, on le dessine
    if(currentCard.snapshot)
    {
        resize();
        //Appliquer le masque
        img = currentCard.snapshot;
        contextBackground.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    //Sinon on dessine les données de codes.js
    else
    {
        // ------ IMG
        img = document.createElement('img');
        img.onload = function() {
            resize();
            contextBackground.fillStyle = "white";
            contextBackground.rect(0, 0, canvas.width, canvas.height);
            contextBackground.fill();
            //Appliquer le masque
            contextBackground.drawImage(img, 0, 0, canvas.width, canvas.height);

            img_Masque.src = currentCard.masque;
        };
        img.src = currentCard.bckg;
    }

    img_Masque = document.createElement('img');
    img_Masque.onload = function() {
        contextMask.drawImage(img_Masque, 0, 0, canvas.width, canvas.height);
        /// change composite mode to use that shape
        contextMask.globalCompositeOperation = 'source-in';
        /// draw the image to be clipped
        contextMask.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    img_Masque.src = currentCard.masque;
}


var pas,
    color,
    xInit,
    yInit,
    width,
    height,
    xDraw,
    yDraw;


var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

var firstRender = true;
function updateRenderCanvas()
{
    contextRender.drawImage(canvas2, 0, 0);
    contextRender.drawImage(canvas, 0, 0);

    if(!firstRender)
    {
        //saveSnapshotThrottled();
    }
    firstRender = false;
}

/**
 * Expérience - Ce qu'il se passe quand signal de la carte est reçu
 */
$(document).keydown(function(e)
{
    if (!cardKeyboardEnabled)
    {
        return;
    }
    var s = String.fromCharCode(e.which);
    if(!s.length)
    {
        return;
    }
    //console.log(s);
    //delay(function(){
    var sensors = currentCard.sensors;
    var sensorsCount = sensors.length;
    for (i = 0; i < sensorsCount; i++)
    {
        if (s !== sensors[i].touches)
        {
            continue;
        }
        updateFromSensorThrottled(sensors[i]);
    }
        //}, 1000 );

});

function updateFromSensor(sensor)
{

    xInit = sensor.centerX;
    yInit = sensor.centerY;
    width = sensor.width;
    height = sensor.height;
    pas = sensor.pas;
    color = getRandomColor();
    xDraw = xInit - (width / 2);
    yDraw = yInit - (height / 2);

    glitchSensor();
    sensor.pas = pas * Math.pow(0.9, (1 / 16) * pas);
    sensor.width += 0.5;
    sensor.height += 0.5;
    xDraw = xInit - (width / 2);
    yDraw = yInit - (height / 2);

    pause_audio_sensorGlitch_debounce();

    updateRenderCanvas();
}

var updateFromSensorThrottled = _.throttle(updateFromSensor, UPDATE_SENSOR_THROTTLE_DELAY);


/**
 * Function exécutée random sur le background
 */
function glitchBkg()
{

    colorRatio = Math.floor(Math.random() * 4) + 2;

    generativeWidth = Math.floor(Math.random() * ((100-50)+1) + 50);
    generativeHeight = Math.floor(Math.random() * ((100-50)+1) + 50);
    coordonateX = Math.floor(Math.random() * ((576-generativeWidth)+1) + 0);
    coordonateY = Math.floor(Math.random() * ((384-generativeHeight)+1) + 0);
    /*
    Math.floor(Math.random() * ((y-x)+1) + x);
    coordonateX = Math.floor(Math.random() * 301) + 200;
    coordonateY = (Math.floor(Math.random() * 201) + 10);
    generativeWidth = Math.floor(Math.random() * 101) + 100;
    generativeHeight = Math.floor(Math.random() * 101) + 100;*/


    //console.log(data);
    if(Math.random() <0.20){
        console.log("je glitch");
        audio_bckgGlitch.play();
        var imageDataMask = contextMask.getImageData(coordonateX, coordonateY , generativeWidth, generativeHeight);
        var imageDataBackground = contextBackground.getImageData(coordonateX, coordonateY , generativeWidth, generativeHeight);
        var dataMask = imageDataMask.data;
        var dataBackground = imageDataBackground.data;
        for(h = 0; h < canvas.height; h++) {
            for(w = 0; w < canvas.width; w++) {
                if(dataMask[3+w*4+(canvas.width*4)*h] !== 0)
                {
                    dataMask[0+w*4+(canvas.width*4)*h] = dataMask[0+w*colorRatio+(canvas.width*4)*h];
                    dataMask[1+w*4+(canvas.width*4)*h] = dataMask[1+w*4+(canvas.width*4)*h];
                    dataMask[2+w*4+(canvas.width*4)*h] = dataMask[2+w*colorRatio+(canvas.width*4)*h];
                    dataMask[3+w*4+(canvas.width*4)*h] = dataMask[3+w*4+(canvas.width*4)*h];
                }
                else {
                    dataBackground[0+w*4+(canvas.width*4)*h] = dataBackground[0+w*colorRatio+(canvas.width*4)*h];
                    dataBackground[1+w*4+(canvas.width*4)*h] = dataBackground[1+w*4+(canvas.width*4)*h];
                    dataBackground[2+w*4+(canvas.width*4)*h] = dataBackground[2+w*colorRatio+(canvas.width*4)*h];
                    dataBackground[3+w*4+(canvas.width*4)*h] = dataBackground[3+w*4+(canvas.width*4)*h];
                }
            }
        }

        contextMask.putImageData(imageDataMask,coordonateX,coordonateY);
        contextBackground.putImageData(imageDataBackground,coordonateX,coordonateY);
        audio_bckgGlitch.pause();
    }

    updateRenderCanvas();

    window.setTimeout(glitchBkg,GLITCH_DELAY);
}
/**
 * Function exécutée lors de l'appuit sur un sensor
 */
function glitchSensor() {
    audio_sensorGlitch.play();
    imageData = contextBackground.getImageData(xDraw, yDraw, width, height);
    //pos = 0; // index position into imagedata array
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            index = (x + (y * imageData.width)) * 4;
            // calculate sine based on distance
            d = Math.sqrt(Math.pow(x, 3) + Math.pow(y, 3));
            t = Math.sin(d / pas);
            // calculate RGB values based on sine
            r = 105 + t * (Math.floor(Math.random() * 255));
            g = 103 + t * (Math.floor(Math.random() * 255));
            b = 100 + t * (Math.floor(Math.random() * 255));
            if (Math.pow((x + xDraw) - xInit, 2) + Math.pow((y + yDraw) - yInit, 2) < Math.pow((width / 2), 2))
            {
                imageData.data[index + 0] = r;
                imageData.data[index + 1] = g;
                imageData.data[index + 2] = b + 50;
                imageData.data[index + 3] = 255;
            }

        }
    }
    imageData = contextBackground.putImageData(imageData, xDraw, yDraw);
    contextBackground.save();
    contextBackground.globalCompositeOperation = "overlay";

    // dessine un rond de couleur d'opacité réduite pour re-coloré la détérioration
    contextBackground.fillStyle = color;
    contextBackground.beginPath();
    contextBackground.arc(xInit, yInit, width / 2, 0, 2 * Math.PI);
    contextBackground.closePath();
    contextBackground.fill();
    // incrémente la position de dessin pour que la transformation soit centré
    xDraw = xInit - (width / 2);
    yDraw = yInit - (height / 2);
}

/**
 * Function exécutée lors de l'appuit sur le boutton info
 */
function pause_audio_sensorGlitch()
{
    audio_sensorGlitch.pause();
}

var pause_audio_sensorGlitch_debounce = _.debounce(pause_audio_sensorGlitch, AUDIO_SENSORGLITCH_DELAY);

/**
 * Function de capture de l'image en cours

 */
var savingSnapshot = false;
var saveOnComplete = false;
function saveSnapshot()
{
    if(!currentCard)
    {
        return;
    }
    if(savingSnapshot)
    {
        saveOnComplete = true;
        return;
    }

    console.log('Saving snapshot...');

    savingSnapshot = true;
    saveOnComplete = false;
    $.post('/snapshots/'+currentCard.idInit, {
        image: canvas3.toDataURL('image/png')
    }, function(data)
    {
        savingSnapshot = false;
        console.log(data);
        if(saveOnComplete)
        {
            saveSnapshot();
        }
    }, 'json');
}
var saveSnapshotThrottled = _.throttle(saveSnapshot, SAVE_SNAPSHOT_THROTTLE_DELAY);

$(function()
{
    function showCard(id, snapshot)
    {
        //delay(function(){
        for (j = 0; j < cards.length; j++) {
            //console.log(cards.lenght);
            if (id == cards[j].idInit) {
                $('.identify').css('display', "none");
                $('.canvas-subwrapper').css('display', "block");
                currentCard = cards[j];
                if(snapshot)
                {
                    currentCard.snapshot = snapshot;
                }
                drawImage();
                glitchBkg();
                cardKeyboardEnabled = true;

            } else {
                $(':input', '.identifyUser').val('');
            }
        }
    }

    $('.identifyUser').on('submit',function(e){
        e.preventDefault();

        var $form = $(e.currentTarget);
        var id = $form.find('input[name=idUser]').val();
        var img = document.createElement('img');
        img.onerror = function()
        {
            showCard(id, null);
        };
        img.onload = function()
        {
            showCard(id, img.naturalWidth ? img:null);
        };
        img.src = '/snapshots/'+id+'.png';
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
        document.getElementById('info-container').style.background = 'url('+img+')';
        document.getElementById("message_au_destinataire").innerHTML = currentCard.message;
        $('#info-button-div .close.heavy, .vertical_info').addClass('changed');
    });

    /**
     * Function exécutée lors de l'appuit sur le boutton capture
     */
    $('#capture-button').on('click', function() {
        cardKeyboardEnabled = false;
        $(':input', '#message-form').not(':submit').val('');
        /*console.log("Je suis egal a "+$('#message-form input:hidden').val());*/
        updateRenderCanvas();
        var dataURL = canvas3.toDataURL('image/png');
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
