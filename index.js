var express = require('express');
var socket = require('socket.io');
var connectDb = require('./config/connectDb');
var parseBody = require('./config/parseBody');

var ProductModel = require('./models/productsModel');

//Setup
var app = express();
var server = app.listen(process.env.PORT, function () {
    console.log(`Listening on port ${process.env.PORT}`);
});
var io = socket(server);

connectDb();

parseBody(app);


//Setup static file
app.use(express.static('public'));
app.set('view engine','ejs');
app.set('views', './views');



io.on('connection', function (socket) {

    socket.on('client-sent-text', data => {
        getRecommendProduct(data);
    })
    console.log('Made socket connection', socket.id);

    socket.on('client-request-call-to-server', function() {
        io.sockets.emit('server-sent-request-to-admin');
    })

    socket.on('admin-accept-call-request-to-server', function(data) {
        console.log(data);
        io.sockets.emit('server-sent-accept-call-from-admin', data);
    })

    socket.on('client-admin-calling-request', function() {
        io.sockets.emit('client-admin-calling-response');
    })

    socket.on('client-sent-transcript-to-server', function(transcript) {
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
        product.id = (i+1);
        product.name = 'product ' + (i+1);
        product.price = (i+1)*1000;
        product.imagePath = 'images/products/product.jpg';
        listProduct.push(product);
    }
    io.sockets.emit('recommend-product', listProduct);
}

function filterKeyWord(data) {

}

app.get('/admin',(req, res)=>{
    res.render('pages/admin_product');
});
app.get('/',(req, res)=>{
    res.render('pages/index');
});
app.get('/admin/call-channel', (req,res)=>{
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

// app.get('/product/key', async (req, res) => {
//     /**
//      * "color": "brown",
// 	"type": "chair",
// 	"price": 600,
// 	"material": "",
// 	"brand": ""
//      */
//     // let color = {}, 
//     //     type, 
//     //     price, 
//     //     material, 
//     //     brand;

//     for (const prop in req.body) {
//         if (prop === 'color' && req.body[prop] !== '') {
//             color = req.body[prop];
//         }
//         if (prop === 'type' && req.body[prop] !== '') {
//             type = req.body[prop];
//         }
//         if (prop === 'price' && req.body[prop] !== '') {
//             price = req.body[prop];
//         }
//         if (prop === 'material' && req.body[prop] !== '') {
//             material = req.body[prop];
//         }
//         if (prop === 'brand' && req.body[prop] !== '') {
//             brand = req.body[prop];
//         }
//     }


//     const products = await ProductModel.getByKey(color, type, price, material, brand);

//     res.send(products);
// })