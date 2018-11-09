import * as express from 'express';
import * as path from 'path';
import * as fileUpload from 'express-fileupload';
import * as fs from 'fs';
import { ImageController, PageController } from './controller';

(async () => {
    const app: express.Application = express();
    const port = process.env.PORT || 3200;

    // Config
    app.use(fileUpload());
    app.use(express.static('public'));

    // Controllers
    app.use('/', PageController);
    app.use('/image', ImageController);

    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}/`);
    });
})();