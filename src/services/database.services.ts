import { MongoClient, ServerApiVersion, Db } from "mongodb"
import { config } from "dotenv";
config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@minhhieu.rhbjque.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version


class DatabaseService {

    private client: MongoClient
    private db: Db
    constructor() {
        this.client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        })
        this.db = this.client.db(`${process.env.DB_NAME}`)
    }

    public async connect(): Promise<void> {
        try {
            // Send a ping to confirm a successful connection
            await this.db.command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
            // Ensures that the client will close when you finish/error
            await this.client.close();
        }

    }
}
const databaseService = new DatabaseService()

export default databaseService
