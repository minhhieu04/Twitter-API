import { MongoClient, ServerApiVersion, Db, Collection } from "mongodb"
import { config } from "dotenv";
import User from "~/models/schemas";
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
        this.db = this.client.db(process.env.DB_NAME)
    }

    public async connect(): Promise<void> {
        try {
            // Send a ping to confirm a successful connection
            await this.db.command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } catch (err) {
            console.log("Could not connect to MongoDB. Please check your connection string.");
            throw err
        }
    }

    get users(): Collection<User> {
        return this.db.collection(process.env.DB_USERS_COLLECTION as string)
    }
}
const databaseService = new DatabaseService()

export default databaseService