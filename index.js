const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.upuo9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");

        app.get("/user", async(req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);});

        app.post('/user', async(req,res)=>{
            const newUser = req.body;
            console.log("adding new user", newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);

        });
        app.delete('/user/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            console.log("deleting user", id);
            const result = await userCollection.deleteOne(query);
            res.send(result);



        });

    }
    finally{
     // await  client.close();

    }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`CRUD server is running`);
});
