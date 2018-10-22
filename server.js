const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const getPixels = require("get-pixels");
const ndarray = require("ndarray");
const jimp = require('jimp');


const PORT = 3200;
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
    if (!req.files) return res.status(400).send('No files were uploaded.');
    console.log("Starting image processing");
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let image = req.files.image;
    console.log(image.mimetype);
    // Use the mv() method to place the file somewhere on your server
    image.mv(FILES_UPLOAD_FOLDER + '/' + image.name, function (err) {
        if (err) return res.status(500).send(err);
        jimp.read(FILES_UPLOAD_FOLDER + '/' + image.name, (err, img) => {
            if (err) return res.status(500).send('Error while resizing image');
            img.scaleToFit(300, 300)
                .quality(60)
                .write(FILES_UPLOAD_FOLDER + '/' + image.name, function () {
                    console.log("File resized");
                    getPixels(FILES_UPLOAD_FOLDER + '/' + image.name, image.mimetype, function (err, pixels) {
                        console.log(err);
                        if (err) return res.status(500).send('Error while reading image pixels');
                        // TODO: Here is data that you need
                        console.log(pixels.data);
                        console.log(pixels.shape);
                        let width = pixels.shape[0];
                        let height = pixels.shape[1];
                        console.log("File size => " + width + " x " + height);
                        res.sendFile(FILES_UPLOAD_FOLDER + '/' + image.name, {root: __dirname}, function (err) {
                            if (err) return res.status(500).send(err);
                            console.log('Image sent to client');
                        });
                    })
                });

        });

    });

});

app.listen(PORT, function () {
    console.log('Server start at port ' + PORT);
    if (!fs.existsSync(FILES_UPLOAD_FOLDER)) {
        fs.mkdirSync(FILES_UPLOAD_FOLDER);
    }
});



