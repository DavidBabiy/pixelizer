// Import only what we need from express
import { Router, Request, Response } from 'express';
import ImageService from "../service/ImageService";
import { logger } from '../util/Utils';
import * as path from "path";


// Assign router to the express.Router() instance
const router: Router = Router();
const imageService: ImageService = ImageService.getInstance();

router.post('/preview', (req, res) => {
    if (!req['files']) return res.status(400).send('No files were uploaded.');
    logger.info("Starting image processing");
    imageService.convertImage(req, res, req['files'].image, true)
});

router.post('/convert', (req, res) => {
    if (!req['files']) return res.status(400).send('No files were uploaded.');
    logger.info("Starting image processing");
    imageService.convertImage(req, res, req['files'].image, false)
});

router.post('/test', (req, res) => {
    if (!req['files']) return res.status(400).send('No files were uploaded.');
    logger.info("Starting image processing");
    imageService.convertImage(req, res, req['files'].image, false)
});

export const ImageController: Router = router;