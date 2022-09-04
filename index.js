const express = require("express");
const app = express();
const fs = require("fs");

let port = 80
let domain = "http://localhost"


const listener = app.listen(process.env.PORT = port, function () {
    console.log(`Url shorter work on ${listener.address().port} port`);
});


function randomletters(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

app.get("/404", (req, res) => {
    res.sendFile(`./db/404/index.html`, {
        root: __dirname
    })
})

app.get("/shorturl", (req, res) => {
    url = req.originalUrl.split("shorturl?=")[1]
    if (url) {
        
        var randomid = randomletters(6)
        var db = JSON.parse(fs.readFileSync(`./db/db.json`))
        if (db[randomid]) {
            randomid = randomletters(7)
        }
        db[randomid] = url
        fs.writeFile(`./db/db.json`, JSON.stringify(db), function (err) {
            if (err) {
                res.send({
                    status: "error"
                })
                return console.log(err);
            }
            res.send({
                status: "OK",
                id: randomid,
                url: domain + `/${randomid}`
            })
        });
    } else {
        res.send("Enter url")
    }
})


// Размещается в самом конце т.к если вышеуказанные app get/post не будут
// использоваться, то будет проверка как раз таки на код

app.use((req, res) => {

    let id = req.originalUrl.replace("/", "")
    let db = JSON.parse(fs.readFileSync(`./db/db.json`))
    if (db[id]) {
        res.redirect(db[id])
    } else {
        res.sendFile(`./db/404/index.html`, {
            root: __dirname
        })
    }
})