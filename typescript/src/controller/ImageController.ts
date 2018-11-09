// Import only what we need from express
import { Router, Request, Response } from 'express';
import ImageService from "../service/ImageService";

// Assign router to the express.Router() instance
const router: Router = Router();
const imageService: ImageService = ImageService.getInstance();

router.post('/preview', (req, res) => {
    if (!req['files']) return res.status(400).send('No files were uploaded.');
    console.log("Starting image processing");
    imageService.convertImage(req, res, req['files'].image, true)
    res.sendStatus(200);
});

router.post('/convert', (req, res) => {
    if (!req['files']) return res.status(400).send('No files were uploaded.');
    console.log("Starting image processing");
    imageService.convertImage(req, res, req['files'].image, false)
    res.sendStatus(200);
});

export const ImageController: Router = router;