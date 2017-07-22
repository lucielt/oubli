//SERVER
var Config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var multer  = require('multer');
var upload = multer();
var router = express.Router();
var _ = require('lodash');
var debug = require('debug');
var debugServer = debug('server');

server.listen(Config.port, function()
{
    debugServer('Server listening on port '+Config.port);
});

//Configuration du système de template
app.set('views', 'public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Configuration de express
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
app.use(bodyParser.json())
app.use(express.static('public'));
app.use('/', router);

//MongoDB
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(Config.mongodb, {
    useMongoClient: true
});

//Créer ton modèle de donnée
var Card = mongoose.model('Card', {
    name: String,
    phrase: String,
    image: Buffer
});

var Snapshot = mongoose.model('Snapshot', {
    code: String,
    image: Buffer
});

/**
 * Snapshot
 */
//Enregistrement du snapshot
app.post('/snapshots/:code', function(req, res)
{
    var image = req.body.image;
    var code = req.params.code.toLowerCase();

    var imageBase64 = image.split(',')[1];
    var imageBuffer = new Buffer(imageBase64, 'base64');

    debugServer('Saving snapshot for '+code+'...');

    Snapshot.findOne({
        code: code
    })
    .exec(function(err, snapshot)
    {
        //Si le snapshot n'existe pas, on en créé un nouveau
        if(err || !snapshot)
        {
            debugServer('Snapshot not found for '+code+'.');
            snapshot = new Snapshot({
                code: code,
                image: imageBuffer
            });
        }
        //Sinon, on update seulement l'image
        else
        {
            debugServer('Snapshot found for '+code+'.');
            snapshot.image = imageBuffer
        }

        //On enregistre
        snapshot.save(function (err, card)
        {
            if (err)
            {
                res.send({
                    'success': false
                });
                return;
            }

            debugServer('Snapshot saved for '+code+'.');

            res.send({
                'success': true
            });
        });
    });
});

app.get('/snapshots/:code/delete', function(req, res)
{
    var code = req.params.code.toLowerCase();

    debugServer('Deleting snapshot for '+code+'...');

    Snapshot.findOne({
        code: code
    })
    .remove(function(err, snapshot)
    {
        if(err)
        {
            res.send('NOT FOUND');
            return
        }

        debugServer('Snapshot deleted for '+code+'.');

        res.send('OK');
    });
});

//Récupère un snapshot s'il y en a un
app.get('/snapshots/:code.png', function(req, res)
{
    var code = req.params.code.toLowerCase();

    Snapshot.findOne({
        code: code
    })
    .exec(function(err, snapshot)
    {
        if(err || !snapshot)
        {
            res.status(500).send('ERROR');
            return;
        }

        res.set('Content-Type', 'image/png');
        res.send(snapshot.image);
    });
});

/**
 * Cards
 */
//Obtenir les images par page
app.get('/cards/:count/:id', function(req, res)
{
    //Requête à la base de données
    var count = parseInt(req.params.count);
    var id = req.params.id+'';
    var params = id !== '-1' || !id.length ? {
        _id: { $gt: id }
    }:{};

    debugServer('Requesting cards from id '+id+' with '+count+' results...');

    Card.find(params)
    .sort('_id')
    .limit(count+1)
    .select('_id name phrase')
    .exec(function(err, cards)
    {
        if(err)
        {
            res.status(500).send('error');
            return;
        }

        debugServer('Requested '+cards.length+' card(s).');

        // affiche la page images.html
        res.set('Content-Type', 'application/json');
        res.send({
            lastPage: cards.length < (count+1) ? true:false,
            items: cards.slice(0, count)
        });
    });
});

//Pour afficher une image
router.get('/cards/:id.png', function(req, res)
{
    Card.findById(req.params.id, function(err, card)
    {
        if(err)
        {
            res.status(500).send('error');
            return;
        }

        res.set('Content-Type', 'image/png');
        res.send(card.image);
    });
});

router.get('/cards/:id/change', function(req, res)
{
    Card.findById(req.params.id, function(err, card)
    {
        if(err)
        {
            res.status(500).send('error');
            return;
        }

        var letters = 'abcdefghijklmnopqrstuvwxyz';
        var phrase = card.phrase.split('');
        var name = card.name.split('');
        var letterIndex = Math.floor(Math.random() * letters.length);
        var phraseIndex = Math.floor(Math.random() * phrase.length);
        phrase[phraseIndex] = letters.charAt(letterIndex);
        card.phrase = phrase.join('');
        var nameIndex = Math.floor(Math.random() * name.length);
        name[nameIndex] = letters.charAt(letterIndex);
        card.name = name.join('');

        card.save(function (err, card)
        {
            if (err){
                res.status(500).send('ERROR');
                return;
            }

            res.send(_.omit(card, ['image']));
        });
    });
});

app.post('/cards', function(req, res)
{
    var image = req.body.image;
    var name = req.body.name;
    var phrase = req.body.phrase;

    debugServer('Saving cards for '+name+'...');

    var imageBase64 = image.split(',')[1];
    var imageBuffer = new Buffer(imageBase64, 'base64');

    var card = new Card({
        name: name,
        phrase: phrase,
        image: imageBuffer
    });
    card.save(function (err, card)
    {
        if (err)
        {
            res.status(500).send({
                'success': false
            });
            return;
        }

        debugServer('Cards saved for '+name+'.');

        res.send({
            'success': true,
            'url': req.hostname+':'+Config.port+'/image/'+card.id
        });
    });
});

module.exports = {
    'io': io,
    'app': app,
    'server': server
};
