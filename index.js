const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
app.use(cors())  
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jtcqgec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const database = client.db("Backpackers");
const usersCollection = database.collection("users");
async function run() {
  try {

    app.post('/users', async(req, res)=>{
        const user = req.body
        console.log(user)
        const query = {email: user.email} 
        const exist = await usersCollection.findOne(query)
        if(exist){
            res.send('user already exist')
        }
        else{
            const result = await usersCollection.insertOne(user) 
            res.send(result)
        }
    })
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Backpacker is running')
})
app.listen(port, ()=>{
    console.log("server is running on port ", port)
})
//