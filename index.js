const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
const port = 4000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a3ov0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db(process.env.DB_NAME).collection("products");
    const ordersCollection = client.db(process.env.DB_NAME).collection("orders");
    
    app.post("/addproduct", (req,res) => {
        const product = req.body;

        collection.insertOne(products)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })

    app.get("/products", (req,res) => {
        collection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get("/product/:key", (req,res) => {
        collection.find({key:req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post("/productsByKeys", (req,res) => {
        const productKeys = req.body;
        collection.find({key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req,res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})