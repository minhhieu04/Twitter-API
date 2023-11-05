import express from "express"
import env from "dotenv"

env.config()

const app = express()
const PORT = process.env.PORT_LOCAL


app.get("/", (req, res) => {
  res.send("Twitter API")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})