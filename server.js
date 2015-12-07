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
app.use(bodyParser.urlencoded({ extended: false }))
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
    res.send('<form action="/save" method="post" enctype="multipart/form-data">'
        + '<p>Nom: <input type="text" name="name"/></p>'
        + '<p>Phrase: <input type="text" name="phrase"/></p>'
        + '<p>Image: <input type="file" name="image"/></p>'
        + '<p><input type="submit" value="Upload"/></p>'
        + '</form>');
});

//Afficher toutes les images
app.get('/cartes', function(req, res) {
    //Requête à la base de données
    Card.find({
        //Peut mettre des paramètres de requête à la base de données
    }).exec(function(err, cards)
    {
        if(err)
        {
            res.send('error');
            return;
        }
        // affiche la page images.html
        res.render('images', {
            cards: cards,
            test: ['allo','Bonjour']
        });
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

//Enregistrer une image
app.post('/save', upload.single('image'), function(req, res)
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
