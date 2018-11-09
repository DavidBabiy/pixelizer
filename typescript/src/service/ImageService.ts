import { Router, Request, Response } from 'express';
import * as fs from "fs";
import { FILES_UPLOAD_FOLDER, MAX_FILE_RESOLUTION } from "../Properties";
import { ansiColorsMap } from "../util/Colors";
import * as getPixels from "get-pixels";
import * as jpeg from "jpeg-js";
import * as colorConvert from "color-convert";
import jimp = require("jimp");


export default class ImageService {
    private static instance: ImageService;
    private constructor() {
        console.log('ImageService constructed');
    }

    static getInstance(){
        if(!ImageService.instance){
            ImageService.instance = new ImageService();
        }
        return ImageService.instance;
    }

   async convertImage(req, res, image, preview) {
        let imageMime = image.mimetype.split('/')[1];
        if (imageMime != 'jpeg' && imageMime != 'png') {
            console.error('Not valid file format');
            res.status(500).json({error: 'Not valid file format'});
        }

        image.mv(FILES_UPLOAD_FOLDER + '/' + image.name, (err) => {
            if (err) return res.status(500).send(err);
            let promise = jimp.read(FILES_UPLOAD_FOLDER + '/' + image.name);
            promise.then(img => {
                img.scaleToFit(MAX_FILE_RESOLUTION, MAX_FILE_RESOLUTION)
                    .quality(100)
                    .write(FILES_UPLOAD_FOLDER + '/' + image.name, () => {
                        console.log("File resized");
                        this.parsePixels(req, res, image, preview ? this.preparePreview : this.writeFile)
                    });
            }, err => {
                res.status(500).send('Error while resizing image');
            });
        });

    };

    async parsePixels(req, res, image, callback) {
        getPixels(FILES_UPLOAD_FOLDER + '/' + image.name, image.mimetype, (err, pixels) => {
            if (err) return res.status(500).send('Error while reading image pixels');
            let fileName = image.name.split('.')[0] + ".txt";
            let width = pixels.shape[0];
            let channels = pixels.shape[2];
            let pixelsMat = [];
            let columnCounter = 0;
            let rowCounter = 0;
            pixelsMat[0] = [];
            let data = [];
            let imageMime = image.mimetype.split('/')[1];

            switch (imageMime) {
                case 'png':
                    data = pixels.data;
                    break;
                case 'jpeg':
                    data = jpeg.decode(fs.readFileSync(FILES_UPLOAD_FOLDER + '/' + image.name), true).data;
                    break;
                default:
                    console.error("Unsupported mime type. Allowed types: jpg, png")
            }
            for (let i = 0; i < data.length; i += channels) {
                if (columnCounter === width) {
                    rowCounter++;
                    pixelsMat[rowCounter] = [];
                    columnCounter = 0;
                }
                let pixel = {
                    ansi: null,
                    r: null,
                    g: null,
                    b: null,
                    a: null
                };
                pixel.ansi = colorConvert.rgb.ansi16(data[i], data[i + 1], data[i + 2]);
                let rgb = colorConvert.ansi16.rgb(pixel.ansi);
                pixel.r = rgb[0];
                pixel.g = rgb[1];
                pixel.b = rgb[2];
                pixel.a = data[i + 3] / 255;
                pixelsMat[rowCounter].push(pixel);
                columnCounter++;
            }
            callback(pixelsMat, fileName, res, pixels);
        });
    };

    async writeFile(pixelsMat, fileName, res, pixels) {
        let width = pixels.shape[0];
        let channels = pixels.shape[2];
        let columnCounter = 0;
        let rowCounter = 0;
        fs.writeFile(FILES_UPLOAD_FOLDER + '/' + fileName, '', (err) => {
            if (err) throw err;
        });
        let writeStream = fs.createWriteStream(FILES_UPLOAD_FOLDER + '/' + fileName);
        for (let i = 0; i < pixels.data.length; i += channels) {
            if (columnCounter === width) {
                rowCounter++;
                columnCounter = 0;
                writeStream.write('\r\n', 'utf-8');
            }
            columnCounter++;
            if (columnCounter < width) {
                let pixel = pixelsMat[rowCounter][columnCounter];
                writeStream.write('${AnsiColor.' + ansiColorsMap[pixel.ansi] + '}', 'utf-8');
                writeStream.write('█', 'utf-8');
            }
        }
        writeStream.on("finish", () => {
            res.sendFile(FILES_UPLOAD_FOLDER + '/' + fileName, {root: __dirname}, (err) => {
                if (err) return res.status(500).send(err);
                console.log('Image sent to client');
            });
        });
        writeStream.end();
    };

    async preparePreview(pixelsMat: any[], fileName: String, res: Response, pixels) {
        console.log('preparePreview');
        res.status(200).json(pixelsMat);
    };
};