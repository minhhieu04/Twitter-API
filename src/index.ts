import express from "express"
import env from "dotenv"
import databaseService from "~/services/database.services"

env.config()

const app = express()
const PORT = process.env.PORT_LOCAL


app.get("/", (req, res) => {
  res.send("Twitter API")
})

databaseService.connect()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})