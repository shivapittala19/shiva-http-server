const express = require("express")
const { v4 : uuidv4 } = require("uuid")
const fs = require("fs")

const app = express()
const PORT = 3000

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/html', (req,res) =>{
    fs.readFile('index.html', 'utf-8', (err, htmlContent) => {
        if (err) {
          console.error(err)
          res.status(500).send('Internal Server Error')
        } else {
          res.send(htmlContent)
        }
      })
})

app.get('/json',(req, res) =>{
    fs.readFile('data.json', 'utf-8', (err, jsonData) =>{
        if(err){
            console.error(err)
            res.status(500).send("Internal server Error")
        }
        else{
            const jsonResponse = JSON.parse(jsonData)
            res.json(jsonResponse)
        }
    })
})

app.get('/uuid', (req, res) => {
    const uuid = uuidv4()
    res.json({ uuid })
})

app.get('/status/:statusCode', (req, res) => {
    const {statusCode} = req.params
    if(parseInt(statusCode) === 100){
        res.send(`Response with status code ${statusCode}`)
        res.status(parseInt(statusCode))
    }
    res.status(parseInt(statusCode)).send(`Response with status code ${statusCode}`)
})

app.get('/delay/:seconds', (req, res) => {
    const { seconds } = req.params
    setTimeout(() =>{
        res.status(200).send(`Response after ${seconds} seconds delay`)
    }, seconds * 1000)
})

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})
