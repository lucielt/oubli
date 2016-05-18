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
