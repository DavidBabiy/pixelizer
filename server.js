const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const gm = require('gm');
const getPixels = require("get-pixels")
const ndarray = require("ndarray")

const PORT = 3000;
const FILES_UPLOAD_FOLDER = 'storage';

app.use(fileUpload());
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/hello', function (req, res) {
    let name = req.query.name;
    if (name === undefined) {
        res.send('Please provide name');
    } else {
        res.send('Hello ' + name);
    }
});

app.post('/file/upload', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let image = req.files.image;
    // Use the mv() method to place the file somewhere on your server
    image.mv(FILES_UPLOAD_FOLDER + '/' + image.name, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
    });
    gm(FILES_UPLOAD_FOLDER + '/' + image.name)
        .resize(300, 300)
        .autoOrient()
        .write(FILES_UPLOAD_FOLDER + '/' + image.name, function (err) {
            if (!err){
                getPixels(FILES_UPLOAD_FOLDER + '/' + image.name, function(err, pixels) {
                    if(err) {
                        console.log("Bad image path");
                        return
                    }
                    console.log(pixels)
                    // res.sendFile(FILES_UPLOAD_FOLDER + '/' + image.name, {root: __dirname}, function (err) {
                    //     if (err) {
                    //         console.log(err);
                    //     } else {
                    //         console.log('File sent');
                    //     }
                    // });
                })
            }
        });
});

app.listen(PORT, function () {
    console.log('Server start at port ' + PORT);
    if (!fs.existsSync(FILES_UPLOAD_FOLDER)){
        fs.mkdirSync(FILES_UPLOAD_FOLDER);
    }

});

