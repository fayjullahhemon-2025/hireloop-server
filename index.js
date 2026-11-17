import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.PORT || 5000

//middlewares
app.use(cors())
app.use(express.json())

//database connection
const client = new MongoClient(process.env.MONGODB_URL);
export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}
const connectedClient = await connectToMongoDB()
const db = connectedClient.db('hireloopV2');

//db collections
const users = db.collection('user')
const jobs = db.collection('jobs')

app.get('/', (req, res) => {
    res.send('hireloop server')
})
//Get all users
app.get('/users', async (req, res) => {
    const cursor = users.find({});
    const allUsers = await cursor.toArray()
    res.send(allUsers);
})
//job related apis
//created jobs api
app.post('/jobs', async (req, res) => {
    const job = req.body;
    const result = await jobs.insertOne(job)
    res.send(result)
})
//get jobs api
app.get('/jobs', async (req, res) => {
    const cursor = jobs.find({})
    const result = await cursor.toArray();
    res.send(result)
})
//delete job api
app.delete('/jobs/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await jobs.deleteOne(query);
    res.send(result)
})
app.listen(port, () => {
    console.log(`hireloop server is running on port ${port}`)

})
