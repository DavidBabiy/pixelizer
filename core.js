const colors = require('./colors');
const fs = require('fs');
const getPixels = require("get-pixels");
const colorConvert = require('color-convert');
const jimp = require('jimp');
const os = require('os');

/** @type Core */
let instance;

/** @type Properties */
const Properties = require('./properties').get();
module.exports.Properties = Properties;

function Core() {
}

Core.prototype.parsePixels = function (req, res, image) {
     getPixels(Properties.FILES_UPLOAD_FOLDER + '/' + image.name, image.mimetype, (err, pixels) => {
        if (err) return res.status(500).send('Error while reading image pixels');
        let width = pixels.shape[0];
        let height = pixels.shape[1];
        let channels = pixels.shape[2];
        let pixelsMat = [];
        let columnCounter = 0;
        let rowCounter = 0;
        pixelsMat[0] = [];
        let textFilename = image.name.split('.')[0] + ".txt";
        fs.writeFile(Properties.FILES_UPLOAD_FOLDER + '/' + textFilename, '', (err) => {
            if (err) throw err;
        });
        let writeStream = fs.createWriteStream(Properties.FILES_UPLOAD_FOLDER + '/' + textFilename);
        for (let i = 0; i < pixels.data.length; i += channels) {
            if (columnCounter === width) {
                rowCounter++;
                pixelsMat[rowCounter] = [];
                columnCounter = 0;
                writeStream.write('\r\n', 'utf-8');
            }
            let pixel = {};
            pixel.r = pixels.data[i];
            pixel.g = pixels.data[i + 1];
            pixel.b = pixels.data[i + 2];
            pixel.a = pixels.data[i + 3];
            pixelsMat[rowCounter].push(pixel);
            columnCounter++;
            let ansiColorCode = colorConvert.rgb.ansi16(pixel.r, pixel.g, pixel.b);
            writeStream.write('${AnsiColor.' + colors.ansiColorsMap[ansiColorCode] + '}', 'utf-8');
            writeStream.write('█', 'utf-8');
        }

        writeStream.on("finish", () => {
            res.sendFile(Properties.FILES_UPLOAD_FOLDER + '/' + textFilename, {root: __dirname}, (err) => {
                if (err) return res.status(500).send(err);
                console.log('Image sent to client');
            });
        });
        writeStream.end();
    })
};

Core.prototype.convertImage = function (req, res, image) {
    image.mv(Properties.FILES_UPLOAD_FOLDER + '/' + image.name, (err) => {
        if (err) return res.status(500).send(err);
        jimp.read(Properties.FILES_UPLOAD_FOLDER + '/' + image.name, (err, img) => {
            if (err) return res.status(500).send('Error while resizing image');
            img.scaleToFit(Properties.MAX_FILE_RESOLUTION, Properties.MAX_FILE_RESOLUTION)
                .quality(100)
                .write(Properties.FILES_UPLOAD_FOLDER + '/' + image.name, () => {
                    console.log("File resized");
                    this.parsePixels(req, res, image)
                });
        });
    });
};

/**
 * @returns {Core}
 */
function get() {
    instance = instance ? instance : new Core();
    return instance;
}

module.exports.get = get;
