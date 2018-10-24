const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const getPixels = require("get-pixels");
const jimp = require('jimp');
const convert = require('color-convert');
const os = require('os');



const PORT = 3000;
const FILES_UPLOAD_FOLDER = 'storage';

app.use(fileUpload());
app.use(express.static('public'));

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/hello',(req, res) => {
    let name = req.query.name;
    if (name === undefined) {
        res.send('Please provide name');
    } else {
        res.send('Hello ' + name);
    }
});

app.post('/file/upload',(req, res) => {
    if (!req.files) return res.status(400).send('No files were uploaded.');
    console.log("Starting image processing");
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let image = req.files.image;
    console.log(image.mimetype);
    // Use the mv() method to place the file somewhere on your server
    image.mv(FILES_UPLOAD_FOLDER + '/' + image.name,(err) => {
        if (err) return res.status(500).send(err);
        jimp.read(FILES_UPLOAD_FOLDER + '/' + image.name, (err, img) => {
            if (err) return res.status(500).send('Error while resizing image');
            img.scaleToFit(30, 30)
                .quality(60)
                .write(FILES_UPLOAD_FOLDER + '/' + image.name,() => {
                    console.log("File resized");
                    getPixels(FILES_UPLOAD_FOLDER + '/' + image.name, image.mimetype,(err, pixels) => {
                        if (err) return res.status(500).send('Error while reading image pixels');
                        // TODO: Here is data that you need
                        let width = pixels.shape[0];
                        let height = pixels.shape[1];
                        let channels = pixels.shape[2];
                        let pixelsMat = [];
                        let columnCounter = 0;
                        let rowCounter = 0;
                        pixelsMat[0] = [];
                        let textFilename = path.basename(FILES_UPLOAD_FOLDER + '/' + image.name, path.extname(FILES_UPLOAD_FOLDER + '/' + image.name));
                        fs.writeFile(FILES_UPLOAD_FOLDER + '/' + textFilename + ".txt", '', (err) => {
                            if(err) throw err;
                        });
                        let writeStream = fs.createWriteStream(FILES_UPLOAD_FOLDER + '/' + textFilename + ".txt");
                            for(let i = 0; i < pixels.data.length; i+=channels) {
                                if (columnCounter === width) {
                                    rowCounter++;
                                    pixelsMat[rowCounter] = [];
                                    columnCounter = 0;
                                    writeStream.write('\n', 'utf-8');
                                }
                                let pixel = {};
                                pixel.r = pixels.data[i];
                                pixel.g = pixels.data[i + 1];
                                pixel.b = pixels.data[i + 2];
                                pixel.a = pixels.data[i + 3];
                                //pixelsMat.push(pixel);
                                pixelsMat[rowCounter].push(pixel);
                                columnCounter++;
                                writeStream.write('█', 'utf-8');
                            }
                            writeStream.end();
                            console.log('First dimension length(height) = ' + pixelsMat.length);
                            console.log('Second dimension length(width) = ' + pixelsMat[0].length);
                            console.log(pixelsMat[0]);
                            res.sendFile(FILES_UPLOAD_FOLDER + '/' + textFilename + ".txt", {root: __dirname},(err) => {
                            if (err) return res.status(500).send(err);
                            console.log('Image sent to client');
                        });
                    })
                });

        });

    });

});

app.listen(PORT,() => {
    console.log('Server start at port ' + PORT);
    if (!fs.existsSync(FILES_UPLOAD_FOLDER)) {
        fs.mkdirSync(FILES_UPLOAD_FOLDER);
    }
});



