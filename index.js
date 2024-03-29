const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.upuo9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("foodExpress").collection("user");

    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

    //geting user/items api

    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //geting user/items api using id dynamyclicly

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //adding and posting user/items api

    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("adding new Item", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //updating user/items api

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updatedItem = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedItem.name,
          price: updatedItem.price,
          quantity: updatedItem.quantity,
          email: updatedItem.email,
          supplier: updatedItem.supplier,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //  deleting user/items api

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      console.log("deleting Item", id);
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await  client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Node");
});

app.listen(port, () => {
  console.log(`CRUD server is running`);
});
