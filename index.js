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

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const usersCollections =HotelDB.collection("usersCollections");
    const rooms_Collections =HotelDB.collection("rooms_collections");
    const bookingCollection =HotelDB.collection("bookingCollection");


app.post('/users',async(req,res)=>{
  const body=req.body;
  const result=await usersCollections.insertOne(body)
  res.send(result)
})
app.get('/users',async(req,res)=>{
  
  const result=await usersCollections.find().toArray()
  res.send(result)
})

    app.get("/rooms",async (req,res)=>{
        const result=await rooms_Collections.find().toArray();
        res.send(result)
     
         
    })
       // Getting Single Room Details
       app.get('/rooms/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await rooms_Collections.findOne(query);
        res.send(result);
    })
   
    // Bookings
    app.post('/bookings', async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData)
      res.send(result);
  })
    app.get('/bookings', async (req, res) => {
      
      const result = await bookingCollection.find().toArray()
      res.send(result);
  })
  
  app.get('/bookings/:id', async (req, res) => {
    const roomId = req.params.id;
    const query = { roomId };
    try {
        const bookings = await bookingCollection.find(query).toArray();
        const bookedDates = bookings.map(booking => {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);

            const dates = [];
            while (start <= end) {
                dates.push(new Date(start).toISOString().split('T')[0]);
                start.setDate(start.getDate() + 1);
            }
            return dates;
        }).flat(); 
        res.send(bookedDates);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch booked dates.' });
    }
});


app.get("/myBookings/:email", async (req, res) => {
  const email = req.params.email;
  const query = { bookedBy: email };
  const cursor = bookingCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
})
      // app.get('/bookings/:id', async (req, res) => {
      //   const query = { _id: new ObjectId(req.params.id) }; 

      //   console.log(query);
      //   try {
      //       const bookings = await bookingCollection.find(query).toArray();
      //       console.log(bookings);
      //       const bookedDates = bookings.map(booking => {
      //           const start = new Date(booking.bookingDate);
      //           const end = new Date(booking.enddate);
      
      //           const dates = [];
      //           while (start <= end) {
      //               dates.push(new Date(start).toISOString().split('T')[0]);
      //               start.setDate(start.getDate() + 1);
      //           }
      //           return dates;
      //       }).flat(); // Flatten the array of date ranges
      //       res.send(bookedDates); 
            
      //   } catch (error) {
      //       res.send({ error: 'Failed to fetch booked dates.' }); 
      //   }
      // });
      




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