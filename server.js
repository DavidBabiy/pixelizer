const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const Core = require('./core').get();
const Properties = require('./core').Properties;

app.use(fileUpload());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/file/preview', (req, res) => {
    if (!req.files) return res.status(400).send('No files were uploaded.');
    console.log("Starting image processing");
    Core.convertImage(req, res, req.files.image, true)
});

app.post('/file/convert', (req, res) => {
    if (!req.files) return res.status(400).send('No files were uploaded.');
    console.log("Starting image processing");
    Core.convertImage(req, res, req.files.image, false)
});

app.listen(Properties.PORT, () => {
    console.log('Server start at port ' + Properties.PORT);
    if (!fs.existsSync(Properties.FILES_UPLOAD_FOLDER)) {
        fs.mkdirSync(Properties.FILES_UPLOAD_FOLDER);
    }
});



