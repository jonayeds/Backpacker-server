const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
app.use(cors({
  origin: '*',
  credentials: true
}))  
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const wishlistCollection = database.collection("wishlist");
const packagesCollection = database.collection("packages");
const bookingsCollection = database.collection("bookings");
const storiesCollection = database.collection("stories");
async function run() {
  try {

    app.post('/users', async(req, res)=>{
        const user = req.body
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
    app.post('/wishlist', async(req, res)=>{
        const wishlist = req.body
        const result = await wishlistCollection.insertOne(wishlist) 
        res.send(result)
    })
    app.post('/bookings', async(req, res)=>{
      const booking = req.body
      const query = {
        date : booking.date,
        email : booking.email
      }
      const exist = await bookingsCollection.findOne(query)
      if(exist){
        res.send({ acknowledged : false})
      }else{
        const result  = await bookingsCollection.insertOne(booking)
        res.send(result)
      }
    })
    app.post('/packages', async(req, res)=>{
      const package = req.body
      const result = await packagesCollection.insertOne(package)
      res.send(result)
    })
    app.post('/stories', async(req, res)=>{
      const story = req.body
      const result  = await storiesCollection.insertOne(story)
      res.send(result)
    })
    app.get('/bookings/:email', async(req, res)=>{
      const email = req.params.email
      const query = {email : email}
      const result = await bookingsCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/bookings/assigned/:email', async(req, res)=>{
      const email = req.params.email
      const query = {guide : email}
      const result = await bookingsCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/bookings/myBookings/:email', async(req, res)=>{
      const email = req.params.email
      const query = {email : email}
      const result = await bookingsCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/wishlist/:email', async(req, res)=>{
        const email = req.params.email
        const result = await wishlistCollection.find({email}).toArray()
        res.send(result)
    })
    app.get('/packages', async(req, res)=>{
      const result = await packagesCollection.find().toArray()
      res.send(result)
    })
    app.get('/tours/:type', async(req, res)=>{
      const type = req.params.type
      const result = await packagesCollection.find({tour_type : type}).toArray()
      res.send(result)
    })
    app.get('/package/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await packagesCollection.findOne(query)
      res.send(result)
    })
    app.get('/users/:email',  async(req, res)=>{
      const email = req.params.email
      const query = {email : email}
      const result = await usersCollection.findOne(query)
      res.send(result)
    })
    app.get('/users', async(req, res)=> {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })
    app.get('/guide', async(req, res)=>{
      const filter = {role : 'guide'}
      const result = await usersCollection.find(filter).toArray()
      res.send(result)
    })
    app.get('/stories', async(req, res)=>{
      const result = await storiesCollection.find().toArray()
      res.send(result) 
    })
    app.get('/story/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await storiesCollection.findOne(query)
      res.send(result) 
    })
    app.delete('/wishlist/:id', async(req, res)=>{
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result = await wishlistCollection.deleteOne(query)
        res.send(result)

    })
    app.delete('/bookings/:id', async (req, res)=>{
      const id = req.params.id
      const query =  {_id: new ObjectId(id)}
      const result = await bookingsCollection.deleteOne(query)
      res.send(result)
    })
    app.put('/users/:email', async (req, res)=>{
      const email = req.params.email
      const query = req.body
      const filter = {email : email}
      const updatedUser = {
        $set : {
          requested: query.requested
        }
      }
      const result = await usersCollection.updateOne(filter, updatedUser)
      res.send(result)
    })
    app.put('/users/guide/update/:email', async(req , res)=>{
      const email = req.params.email
      const filter = {email: email}
      const query = req.body
      const updatedUser = {
        $set : {
          phone : query.phone,
          experience : query.experience,
          education : query.education
        }
      }
      const result = await usersCollection.updateOne(filter, updatedUser)
      res.send(result)
    })
    app.put('/users/updateRole/:id', async(req , res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id) }
      const query = req.body
      const updatedUser = {
        $set : {
          role : query.role,
          updated : query.updated,
        }
      }
      const result = await usersCollection.updateOne(filter, updatedUser)
      res.send(result)
    })
    app.put('/bookings/:id', async(req, res)=>{
      const id = req.params.id
      const filter = {_id : new ObjectId(id)}
      const query = req.body
      const updatedBooking = {
        $set: {
          status : query.status
        }
      }
      const result = await bookingsCollection.updateOne(filter, updatedBooking)
      res.send(result)
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