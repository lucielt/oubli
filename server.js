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

server.listen(Config.port);

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
mongoose.connect(Config.mongodb);

//Créer ton modèle de donnée
var Card = mongoose.model('Card', {
    name: String,
    phrase: String,
    image: Buffer
});

//Formulaire test pour enregistrer une image
app.get('/test', function(req, res) {
    res.send();
});


app.get('/images/page/:count/:id', function(req, res) {
    //Requête à la base de données
    var count = parseInt(req.params.count);
    var id = req.params.id+'';
    var params = id !== '-1' || !id.length ? {
        _id: { $gt: id }
    }:{};

    Card.find(params)
    .sort('_id')
    .limit(count)
    .select('_id name phrase')
    .exec(function(err, cards)
    {
        if(err)
        {
            res.send('error');
            return;
        }
        // affiche la page images.html
        res.set('Content-Type', 'application/json');
        res.send(cards);
    });
});

//Pour afficher une image
router.get('/image/:id', function(req, res) {
    Card.findById(req.params.id, function(err, card)
    {
        if(err)
        {
            res.send('error');
            return;
        }
        res.set('Content-Type', 'image/png');
        res.send(card.image);
    });
});

app.post('/save', function(req, res)
{
    var image = req.body.image;
    var name = req.body.name;
    var phrase = req.body.phrase;

    var imageBase64 = image.split(',')[1];
    var imageBuffer = new Buffer(imageBase64, 'base64');

    var card = new Card({
        name: name,
        phrase: phrase,
        image: imageBuffer
    });
    card.save(function (err, card)
    {
        if (err){
            console.log('ERROR');
            return;
        }
        console.log('Saved');
        // affiche la page merci.html
        res.send({
            'url': req.hostname+':'+Config.port+'/image/'+card.id
        });
    });
});

//Enregistrer une image
app.post('/upload', upload.single('image'), function(req, res)
{
    var name = req.body.name;
    var phrase = req.body.phrase;

    var card = new Card({
        name: name,
        phrase: phrase,
        image: req.file.buffer
    });
    card.save(function (err)
    {
        if (err){
            console.log('ERROR');
            return;
        }
        console.log('Saved');
        // affiche la page merci.html
        res.render('merci');
    });
});

module.exports = {
    'io': io,
    'app': app,
    'server': server
};
