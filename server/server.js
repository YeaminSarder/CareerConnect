require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())
app.use('/api', require('./routes'))
app.use((err, req, res, next) => {
	if (err instanceof SyntaxError && "body" in err) {
		console.error(err)
        return res.status(400).json({
            message: "Invalid JSON"
        });
    }
	next()
})
app.use((err, req, res, next) => {		
    console.error(err);
    res.status(500).json({
        message: "Internal Server Error"
    });
});
mongoose.connect(process.env.MONGO_URI)
	.then( () => { 
      app.listen(process.env.PORT,() => {
	    console.log("connected to db and listening..")
      })
    }).catch( (err) => {console.log (err.message)}
)
