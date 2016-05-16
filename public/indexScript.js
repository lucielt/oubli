/*if ($(window).scrollTop() == $(document).height() - $(window).height()){
    alert('Hello World');
}*/
var url = location.pathname;
console.log(url);

if (url == '/projet.html') {
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
    /*if(videoRatio > viewRatio) {
      height = viewHeight;
      width = viewHeight * videoRatio;
      top = 0;
      left = -((width - viewWidth)/2);
    } else {
      width = viewWidth;
      height = viewWidth / videoRatio;
      left = 0;
      top = -((height - viewHeight)/2);
    }*/
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

    // ------ IMG
    var img = new Image();
    img.src = '/image/000.jpg';

    var img2 = new Image();
    img2.src = 'rose.png';

    var img3 = new Image(),
        imgData;
    img3.src = 'telechargement.png';

    // ------ AUDIO
    var audio = document.getElementById("prout");

    // ----------------------------------------------------------------------------

    img.onload = function() {
        resize();
        ctx.fillStyle = "white";
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
        //draw();
    };

    var socket = io.connect('http://localhost:8080');
    //var x, y, button;           // readings from the server

    //sx=x de l'image source, x=x de la destination
    var sensors = [{
        data: '0',
        color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
        pointX: [0, 77, 84, 88, 91, 108, 126, 129, 134, 0],
        pointY: [164, 217, 253, 263, 300, 326, 329, 374, 384, 384],
        centerX: 0,
        centerY: 250,
        width: 10,
        height: 10,
        pas: 20,
        radius: 50,
        touches: 'Þ',
        nbRow: 2
    }, {
        data: '1',
        color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
        pointX: [110, 165, 186, 177, 183, 200, 223, 256, 285, 285, 273, 234, 218, 106, 125, 171, 165, 142],
        pointY: [0, 0, 40, 49, 71, 87, 98, 99, 83, 115, 138, 158, 160, 174, 131, 85, 67, 42],
        centerX: 186,
        centerY: 86,
        width: 10,
        height: 10,
        pas: 20,
        radius: 100,
        touches: 'À',
        nbRow: 2
    }, {
        data: '2',
        color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
        pointX: [221, 543, 536, 576, 576, 502, 451, 400, 340, 336, 285, 265, 225, 189, 186, 201],
        pointY: [0, 0, 22, 0, 154, 158, 190, 183, 114, 55, 74, 87, 91, 68, 51, 33],
        centerX: 437,
        centerY: 85,
        width: 10,
        height: 10,
        pas: 30,
        radius: 100,
        touches: '3',
        nbRow: 2
    }, {
        data: '3',
        color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
        pointX: [374, 393, 440, 462, 497, 534, 576, 576, 538, 523, 482, 472, 464, 458, 433, 448, 441, 441, 355, 360, 350, 346, 352],
        pointY: [185, 192, 200, 197, 175, 171, 200, 384, 373, 373, 336, 338, 317, 318, 288, 210, 206, 214, 339, 211, 292, 258, 205],
        centerX: 475,
        centerY: 267,
        width: 10,
        height: 10,
        pas: 40,
        radius: 5,
        touches: '5',
        nbRow: 2
    }, {
        data: '4',
        color: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9'],
        pointX: [336, 336, 325, 322, 301, 301, 246, 219, 215, 191, 167, 145, 133, 125, 134, 141, 134, 138],
        pointY: [384, 351, 337, 324, 306, 299, 274, 294, 303, 299, 294, 307, 310, 318, 329, 339, 352, 384],
        centerX: 234,
        centerY: 349,
        width: 10,
        height: 10,
        pas: 50,
        radius: 10,
        touches: '8',
        nbRow: 2
    }, ];

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
        pointY,
        decalagePointX = (window.innerWidth - canvas.width) / 2,
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
    $(document).keydown(function(e) {
        var s = String.fromCharCode(e.which);
        //console.log(s);
        //delay(function(){
        for (i = 0; i < sensors.length; i++) {
            if (s == sensors[i].touches) {
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
        var imgPointX = [0, 110, 142, 165, 171, 125, 106, 218, 234, 273, 285, 285, 256, 223, 200, 183, 177, 186, 165, 221, 201, 186, 189, 225, 265, 285, 336, 340, 400, 451, 502, 576, 576, 534, 497, 462, 440, 393, 374, 352, 346, 350, 360, 355, 441, 441, 448, 433, 458, 464, 472, 482, 523, 538, 576, 336, 336, 325, 322, 301, 301, 246, 219, 215, 191, 167, 145, 133, 125, 134, 141, 134, 138, 134, 129, 126, 108, 91, 88, 84, 77, 0];
        var imgPointY = [0, 0, 42, 67, 85, 131, 174, 160, 158, 138, 115, 83, 99, 98, 87, 71, 49, 40, 0, 0, 33, 51, 68, 91, 87, 74, 55, 114, 183, 190, 158, 154, 200, 171, 175, 197, 200, 192, 185, 205, 258, 292, 321, 339, 214, 206, 210, 288, 318, 317, 338, 336, 373, 373, 384, 384, 351, 337, 324, 306, 299, 274, 294, 303, 299, 294, 307, 310, 318, 329, 339, 352, 384, 384, 374, 329, 326, 300, 263, 253, 217, 164];
        var long = imgPointX.length;
        ctx2.save();
        ctx2.globalCompositeOperation = "normal";
        ctx2.beginPath();
        ctx2.moveTo(imgPointX[0], imgPointY[0]);
        for (j = 1; j < imgPointX.length; j++) {
            ctx2.lineTo(imgPointX[j], imgPointY[j]);
            //console.log("jesuisla", imgPointX[j], imgPointY[j]);
        }
        //ctx3.closePath();
        ctx2.clip();
        ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
        ctx2.drawImage(img2, 0, 0, canvas2.width, canvas2.height);
        ctx2.restore();
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
    function draw(){
        var imgPointX =[0, 110, 142, 165, 171, 125, 106, 218, 234, 273, 285, 285, 256, 223, 200, 183, 177, 186, 165, 221, 201, 186, 189, 225, 265, 285, 336, 340, 400, 451, 502, 576, 576, 534, 497, 462, 440, 393, 374, 352, 346, 350, 360, 355, 441, 441, 448, 433, 458, 464, 472, 482, 523, 538, 576, 336, 336, 325, 322, 301, 301, 246, 219, 215, 191, 167, 145, 133, 125, 134, 141, 134, 138, 134, 129, 126, 108, 91, 88, 84, 77, 0];
        var imgPointY = [0, 0, 42, 67, 85, 131, 174, 160, 158, 138, 115, 83, 99, 98, 87, 71, 49, 40, 0, 0, 33, 51, 68, 91, 87, 74, 55, 114, 183, 190, 158, 154, 200, 171, 175, 197, 200, 192, 185, 205, 258, 292, 321, 339, 214, 206, 210, 288, 318, 317, 338, 336, 373, 373, 384, 384, 351, 337, 324, 306, 299, 274, 294, 303, 299, 294, 307, 310, 318, 329, 339, 352, 384, 384, 374, 329, 326, 300, 263, 253, 217, 164];
        var long = imgPointX.length;
        ctx3.fillStyle = 'white';
        ctx3.beginPath();
        ctx3.moveTo(imgPointX[0], imgPointY[0]);
        for (j=1; j< imgPointX.length; j++){
            ctx3.lineTo(imgPointX[j], imgPointY[j]);
            //console.log("jesuisla", imgPointX[j], imgPointY[j]);
        }
        //ctx3.closePath();
        ctx3.fill();
        ctx3.clip();
        ctx3.drawImage(img, 0, 0, canvas2.width, canvas2.height);
        ctx3.drawImage(img2, 0, 0, canvas2.width, canvas2.height);
    }

    function drawSquare(){
        for (var row = 0; row < nbCell; row ++){
            for (var column = 0; column < nbCell; column ++){
                // coordinates of the top-left corner
                var x1 = (xInit - (cellWidth*pas2)) + column * 4;
                var y2 = (yInit - (cellWidth*pas2)) + row * 4;
                console.log("X " + x1 + " Y " + y2);

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
                ctx2.fillRect(x1, y2, cellWidth, cellWidth);
            }
        }
    }*/
    // Const
    jQuery.fn.extend({
        disable: function(state) {
            return this.each(function() {
                var $this = $(this);
                $this.toggleClass('disabled', state);
            });
        }
    });

    $('#info-button').on('click', function() {
        $('#info-button a').disable(true);
        $('#canvas-info').show();
        $('#capture-button-div').hide();
        $('.canvas-line').css("background-color", "transparent");
        $('#info-button-div .close.heavy, .vertical_info').addClass('changed');
    });

    $('#capture-button').on('click', function() {
        $(':input', '#message-form').not(':submit')
            .val('');
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
    $('.close').on('click', function() {
        $('#canvas-info, #canvas-capture').hide();
        //$('#canvas-capture').hide();
        $('#info-button-div, #capture-button-div, .camera-icon').show();
        //$('#capture-button-div').show();
        $('.canvas-line').css("background-color", "#2e2e2e");
        $('#capture-button-div .close.heavy, #info-button-div .close.heavy, .vertical_capture, .vertical_info').removeClass('changed');
        $('#capture-button a, #info-button a').disable(false);
        //$('#info-button a').disable(false);
    });
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

} else if (url == '/images.html') {

            var pagesData = [];
            var pagesImagesLoaded = [];
            var pageIndex = 0;
            var imagesPerPage = 6;
            var imagesTemplate, imageTemplate;
            var lastPageReached = false;

            /**
             * Ajoute un éléments .images avec des données d'une page
             */
            var showPage = function(data)
            {
                console.log('Ajoute la nouvelle page.');
                var imagesHtml = imagesTemplate({});
                var $imagesPage = $(imagesHtml);
                $('.images-container').append($imagesPage);
                var $list = $imagesPage.find('.ul-container');
                var imageHtml, $image;
                for(var i = 0, l = data.length; i < l; i++)
                {
                    imageHtml = imageTemplate({
                        card: data[i]
                    });
                    $image = $(imageHtml);
                    $list.append($image);
                }
            };

            /**
             * Fait l'animation de changement de page
             */
            var switchPage = function ()
            {
                console.log('Anime le changement de page.');
                var $imagesPages = $('.images-container .images');
                var $imagesPage = $imagesPages.filter(':last');
                var pagesCount = $imagesPages.length;
                var timeline = new TimelineMax({
                    paused: true
                });

                //S'il y a plus de 2 éléments .images de présent, on enlève les anciennes images
                if(pagesCount > 1)
                {
                    timeline.staggerTo($imagesPages.eq(0).find('.image').toArray(), 0.2, {
                        alpha: 0,
                        onComplete: function()
                        {
                            $imagesPages.eq(0).remove();
                        }
                    }, 0.1);
                }

                //Afficher les nouvelles images
                timeline.staggerFromTo($imagesPages.eq(pagesCount-1).find('.image').toArray(), 0.2, {
                    alpha: 0,
                    scale: 0.2
                }, {
                    alpha: 1,
                    scale: 1
                }, 0.1);

                /**
                 * Animation des liens Plus et moins
                 */
                //Si on est à la première page
                if (pageIndex === 0)
                {
                    timeline.to($('#loadLess p'), 0.2, {
                        alpha: 0
                    }, 0);
                    timeline.to($('#loadMore p'), 0.2, {
                        alpha: 1
                    }, 0);
                }
                //Si on a attein la fin
                else if(pageIndex === pagesData.length-1 && lastPageReached)
                {
                    timeline.to($('#loadMore p'), 0.2, {
                        alpha: 0
                    }, 0);
                    timeline.to($('#loadLess p'), 0.2, {
                        alpha: 1
                    }, 0);
                }
                //On s'assure que les 2 liens sont visibles si on est dans le milieu
                else
                {
                    timeline.to($('#loadMore p, #loadLess p'), 0.2, {
                        alpha: 1
                    }, 0);
                }

                //Si les images n'ont pad déjà été loadés on attend la fin avant de démarrer l'animation
                if(!pagesImagesLoaded[pageIndex])
                {
                    var loadingCount = $imagesPage.find('img').length;
                    var loadedCount = 0;
                    $imagesPage.find('img').on('load', function()
                    {
                        loadedCount++;
                        if(loadingCount === loadedCount)
                        {
                            pagesImagesLoaded[pageIndex] = true;
                            timeline.play();
                        }
                    });
                }
                else
                {
                    timeline.play();
                }

                return timeline;
            };

            /**
             * Charge les données d'une nouvelle page
             */
            var loadPage = function(id, cb)
            {
                //Afficher le loading
                TweenMax.fromTo($('#loading'), 0.2, {
                    alpha: 0
                }, {
                    alpha: 1
                });

                //Si aucun arguments est fourni à la fonction
                if(typeof(id) === 'undefined')
                {
                    id = '-1';
                }
                //Si le premier argument fourni à la fonction est une fonction, on
                // l'utilise comme callback
                else if(_.isFunction(id))
                {
                    cb = id;
                    id = '-1';
                }

                //Chargement ajax
                $.getJSON('/images/page/'+imagesPerPage+'/'+id, function(data)
                {
                    var tweenLoading = TweenMax.to($('#loading'), 0.2, {
                        alpha: 0
                    });

                    //S'il y a des données, ont les ajoutes.
                    if(data.length)
                    {
                        pagesData.push(data);
                    }

                    //Si on a atteint la fin de toutes les pages, ont le stock.
                    if(data.length < imagesPerPage || !data.length)
                    {
                        lastPageReached = true;
                    }

                    //On appelle le callback s'il est présent
                    if(typeof(cb) !== 'undefined')
                    {
                        cb(data);
                    }
                });
            };

            //Prochaine page
            function nextPage()
            {
                var nextIndex = pageIndex+1;
                var page;

                //Si on a attein la fin
                if(!pagesData[nextIndex] && lastPageReached)
                {
                    console.log('Fin atteint.');
                    return;
                }
                //La page n'est pas encore loadé
                else if(!pagesData[nextIndex])
                {
                    console.log('Charger la prochaine page');

                    //On prend le dernier ID de la dernière page qu'on a loadé.
                    page = pagesData[pageIndex];
                    var lastId = page[page.length-1]._id;

                    //On charge une nouvelle page à partir de se ID
                    loadPage(lastId, function(data)
                    {
                        //Si on a des données, on change l'index de page et on l'affiche
                        if(data.length)
                        {
                            pageIndex = nextIndex;
                            showPage(data);
                            switchPage();
                        }
                    });
                    return;
                }
                //La page est déjà loadée, on l'affiche.
                else
                {
                    pageIndex = nextIndex;
                    page = pagesData[pageIndex];
                    showPage(page);
                    switchPage();
                }

            }

            function prevPage()
            {
                if(pageIndex === 0)
                {
                    console.log('Début atteint.');
                    return;
                }

                //On affiche la page précédente
                pageIndex = pageIndex-1;
                var page = pagesData[pageIndex];
                showPage(page);
                switchPage();
            }

            $(function()
            {
                imagesTemplate = _.template($('#imagesTemplate').html());
                imageTemplate = _.template($('#imageTemplate').html());

                $('#loadMore a').on('click', function(e)
                {
                    e.preventDefault();

                    nextPage();
                });

                $('#loadLess a').on('click', function(e)
                {
                    e.preventDefault();

                    prevPage();
                });

                $('.images-container').on('click', '.image-link', function(e)
                {
                    e.preventDefault();

                    var id = $(e.currentTarget).data('id');
                    var $list = $(e.currentTarget).parents('.ul-container');

                    //Appel au serveur pour faire le changement aléatoire
                    $.getJSON('/change/'+id, function(data)
                    {
                        //Créer un nouvel élément avec le template et les nouvelles données
                        var imageHtml = imageTemplate({
                            card: data
                        });
                        imageHtml = $(imageHtml).html();

                        //Remplate l'élément actuel avec le nouveau html généré avec les nouvelles données
                        $list.find('li.image[data-id="'+data._id+'"]').html(imageHtml);
                    });
                });

                //On charge la première page
                loadPage(function(data)
                {
                    if(data.length)
                    {
                        showPage(data);
                        switchPage();
                    }
                });

            });
}
