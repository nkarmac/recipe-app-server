const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
require("dotenv").config()

PORT = process.env.PORT || 5000
RECIPE_API = `${process.env.RECIPE_API}`

const { rateLimit } = require('express-rate-limit')
const limiter = rateLimit({
    windowMs: 2000,
    limit: 1,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Requesting too quick, please wait.'
})

app.use(cors())
app.use(limiter)

app.get('/', (req,res) => {
    res.status(200).send("Welcome.");
})

app.get('/recipes/:query', async (req,res) => {
    console.log(`Recipe requested: ${req.params.query} at ${new Date().toISOString()}`);
    
    try{
        const response = await axios.get(
            `${RECIPE_API}?type=public&q=${req.params.query}&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`);
        
        res.status(200).json(response.data.hits);
    }
    catch(error)    {
        res.status(400).json({message:"Error Fetching Data"})
    }
})

app.all("*",(req,res) => {
    res.status(404).json({message: "URL Not Found."})
})

app.listen(PORT, (err) => {
    if (err)    {
        console.log("Server Connection Error"); 
    }
    console.log(`Listening on port ${PORT}`);
})

const reload_url = `${process.env.RELOAD_URL}`;
const interval = 30000;

function reloadWebsite() {
    axios.get(reload_url)
        .then(response => {
            console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
        })
        .catch(error => {
            console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
        });
}

setInterval(reloadWebsite, interval);