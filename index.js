var express = require('express');
var socket = require('socket.io');
var connectDb = require('./config/connectDb');
var parseBody = require('./config/parseBody');
const { exec } = require('child_process');
const language = require('@google-cloud/language');

var ProductModel = require('./models/productsModel');

exec('export GOOGLE_APPLICATION_CREDENTIALS="/app/sbec-1589703101362-79735a847581.json"', function (error, stdout, stderr) {
    if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
    }
    console.log('Child Process STDOUT: ' + stdout);
    console.log('Child Process STDERR: ' + stderr);
});

// exec('pwd', function (error, stdout, stderr) {
//     if (error) {
//       console.log(error.stack);
//       console.log('Error code: '+error.code);
//       console.log('Signal received: '+error.signal);
//     }
//     console.log('Child Process STDOUT: '+stdout);
//     console.log('Child Process STDERR: '+stderr);
//   });

//   exec('ls', function (error, stdout, stderr) {
//     if (error) {
//       console.log(error.stack);
//       console.log('Error code: '+error.code);
//       console.log('Signal received: '+error.signal);
//     }
//     console.log('Child Process STDOUT: '+stdout);
//     console.log('Child Process STDERR: '+stderr);
//   });



//Setup
var app = express();
var server = app.listen(process.env.PORT, function () {
    console.log(`Listening on port ${process.env.PORT}`);
});
// var server = app.listen(1300, function () {
//     console.log(`Listening on port `);
// });
var io = socket(server);

connectDb();

parseBody(app);


//Setup static file
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');



io.on('connection', function (socket) {

    socket.on('client-sent-text', data => {
        getRecommendProduct(data);
    })
    console.log('Made socket connection', socket.id);

    socket.on('client-request-call-to-server', function () {
        io.sockets.emit('server-sent-request-to-admin');
    })

    socket.on('admin-accept-call-request-to-server', function (data) {
        console.log(data);
        io.sockets.emit('server-sent-accept-call-from-admin', data);
    })

    socket.on('client-admin-calling-request', function () {
        io.sockets.emit('client-admin-calling-response');
    })

    socket.on('client-sent-transcript-to-server', function (transcript) {
        console.log(transcript);
    })
});

//filter
function getRecommendProduct(data) {
    filterKeyWord(data);
    let listProduct = [];
    //fake data
    for (let i = 0; i < 2; i++) {
        let product = {
            id: 0
        }
        product.id = (i + 1);
        product.name = 'product ' + (i + 1);
        product.price = (i + 1) * 1000;
        product.imagePath = 'images/products/product.jpg';
        listProduct.push(product);
    }
    io.sockets.emit('recommend-product', listProduct);
}

function filterKeyWord(data) {

}

app.get('/admin', (req, res) => {
    res.render('pages/admin_product');
});
app.get('/', (req, res) => {
    res.render('pages/index');
});
app.get('/admin/call-channel', (req, res) => {
    res.render('pages/call_channel');
});

app.post('/product/new', (req, res) => {
    req.body.products.map(item => {
        ProductModel.createNew(item);
    })

    res.send('DONE');
});

app.get('/product/all', async (req, res) => {
    const products = await ProductModel.getAll();

    res.send(products);
});

async function catchKeyRequirement(text) {
    // Instantiates a client
    const client = new language.LanguageServiceClient();
  
    // The text to analyz;
  
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
  
    // Detects the sentiment of the text
    const [resultSentiments] = await client.analyzeSentiment({ document });
  
    // Get all sentences
    const sentences = resultSentiments.sentences;
  
    let positiveSentences = sentences.filter(sentence => {
      if (sentence.sentiment.score > 0) return true;
      return false;
    });
  
    let results = [];
  
    results = positiveSentences.map(async sentence => {
      const document = {
        content: sentence.text.content,
        type: 'PLAIN_TEXT',
      };
  
      return await client.analyzeEntities({ document });
    });
  
    results = await Promise.all(results);
  
    results = results.map(result => {
      return {
        name: result[0].entities[0].name,
        type: result[0].entities[0].type
      }
    });
  
    // getProductByKey(results);
  }
