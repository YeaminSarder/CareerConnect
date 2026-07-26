import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import apiRoutes from './routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', apiRoutes)
app.use((err, req, res, next) => {
	if (err instanceof SyntaxError && "body" in err) {
		console.error(err)
        return res.status(400).json({
            error: "Invalid JSON"
        });
    }
	next()
})
app.use((err, req, res, next) => {		
    console.error(err);
    res.status(500).json({
        error: "Internal Server Error"
    });
});
mongoose.connect(process.env.MONGO_URI)
	.then( () => { 
      app.listen(process.env.PORT,() => {
	    console.log("connected to db and listening..")
      })
    }).catch( (err) => {console.log (err.message)}
)
