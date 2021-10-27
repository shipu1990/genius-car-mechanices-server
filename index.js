const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8s3t0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect ();
        console.log('DB Connected')

        const database = client.db('carMechanic')
        const servicesCollection = database.collection("services")

        // Get APi
        app.get('/services', async(req, res) =>{
            const query = servicesCollection.find({});
            const services = await query.toArray();
            res.send(services);
        })

        //Get Single Service API

        app.get('/services/:id', async (req, res) =>{
            const id = req.params.id;
            console.log('Geting Id', id);
            const query = { _id : ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        // API Delete
        app.delete('/services/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id : ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

        // API Post
        app.post('/services', async (req, res)=>{
            const service = req.body ;
            // console.log('Api Hitted', service)
            
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result)
        });
    } finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Running Genius Server');
})
app.listen(port, () =>{
    console.log('Running Genius Server on Port', port)
})