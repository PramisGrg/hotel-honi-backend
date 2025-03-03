import { config } from "dotenv"
config()
import cors from "cors"
import express from "express"
import morgan from "morgan"
import mainRouter from "./routes/main.routes"
import { genericErrorHandler } from "./middlewares/genericErrorHandler.middleware"
import Database from "./configs/db.config"
import { NotFoundController } from "./utils/notFound.utils"

const app = express()

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.set("port", process.env.PORT)
app.set("host", "0.0.0.0")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use(mainRouter)
app.use("*", NotFoundController)
app.use(genericErrorHandler)

Database.connect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`App started listening on port: ${process.env.PORT}`)
  })
})
