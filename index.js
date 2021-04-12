const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iokbq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello sir!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJhonStore").collection("products");
    const ordersCollection = client.db("emaJhonStore").collection("orders");

    console.log('database connected');

    //insert one products to db
    app.post('/addProduct', (req, res) => {
        const products = req.body
        productsCollection.insertOne(products)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })

    })

    //show all product
    app.get('/products', (req, res) => {
        const search = req.query.search;
        productsCollection.find({name: {$regex: search}})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //show single product
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    //show many products by keys
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            })


    })

    //for orders

    app.post('/addOrder', (req, res) => {
        const order = req.body
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })













});


















app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})