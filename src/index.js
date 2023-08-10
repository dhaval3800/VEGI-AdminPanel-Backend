const express = require("express")
require("dotenv").config();
require("./db/mongoose")
const userRouter = require('./router/user')
const categoryRouter = require('./router/category')
const postRouter = require('./router/post')
const unitRouter = require('./router/unit')
const priceRouter = require('./router/price')
const errorHandler = require("./express-middleware/errorhandler")


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(categoryRouter)
app.use(postRouter)
app.use(unitRouter) 
app.use(priceRouter)

app.use(errorHandler)

app.listen(port, ()=>{
    console.log("Server is up on port " + port)
})
