const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 8022;



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnv3d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("barberShop").collection("bookings");
  const bookedCollection = client.db("barberShop").collection("booked");
  const reviewCollection = client.db("barberShop").collection("review");
  const AdminCollection = client.db("barberShop").collection("admin");

  app.post('/addServices', (req,res) => {
    const newProduct = req.body;
    servicesCollection.insertOne(newProduct)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  app.get('/services', (req, res) => {
    servicesCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })
  app.delete('/deleteItem/:id', (req,res) =>{
    const id = ObjectID(req.params.id);
    servicesCollection.findOneAndDelete({_id: id})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
 })
  app.get('/reviews', (req, res) => {
    reviewCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })
  app.get('/service/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    servicesCollection.find({_id: id})
    .toArray((err, documents) => {
       res.send(documents[0])
    })

   })
   app.post('/serviceBooked', (req, res) => {
    const order = req.body;
    bookedCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})
   app.post('/addAdmin', (req, res) => {
    const order = req.body;
    AdminCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})
app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  AdminCollection.find({ email: email })
    .toArray((err, admins) => {
      res.send(admins.length > 0);
    })
})

   app.post('/addReview', (req, res) => {
    const order = req.body;
    reviewCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})
app.get('/servicesList', (req, res) => {
    bookedCollection.find({ email: req.query.email })
    .toArray((err, documents) => {
      res.status(200).send(documents);
    })
 })
app.get('/orderList', (req, res) => {
    bookedCollection.find()
    .toArray((err, documents) => {
      res.status(200).send(documents);
    })
 })

  
});






app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })