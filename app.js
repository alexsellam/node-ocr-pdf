const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const { createWorker } = require("tesseract.js")



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
    
});

const upload = multer({storage: storage}).single('avatar');

app.set("view engine", "ejs");


app.get('/', (req, res) => {
    res.render("index");
})

app.post('/upload', (req, res)=> {
    upload(req, res, err => {
        fs.readFile(`./uploads/${req.file.originalname}`, (err, img) => {
            if(err) return console.log('This is your error', err);
            (async () => {
                const worker = createWorker();
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(img);
                console.log(text);
                res.send(text);
              })();
            });
    });
});


const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running on ${PORT}`)); 