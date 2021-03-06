const express = require('express')
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
const News = require('./models/news')
const Reporter = require('./models/reporter')
const app = express()
const port = process.env.PORT || 3000

require('./db/mongoose')

app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)

app.listen(port,()=>{
    console.log('Server is running on port ' + port)})