const express = require('express')
const app = express()
const cors = require('cors');
const PORT = process.env.PORT || 5000;
// hotel_quest.rooms_collections

const dotEnv=require('dotenv')
dotEnv.config()
// Use CORS middleware to allow cross-origin requests
app.use(cors());
// Middleware to parse incoming JSON data
app.use(express.json());


// Mongodb

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zovp9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const HotelDB = client.db("hotel_quest");
    const rooms_Collections =HotelDB.collection("rooms_collections");




    app.get("/rooms",async (req,res)=>{
        const result=await rooms_Collections.find().toArray();
        res.send(result)
     
         
    })
   




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})