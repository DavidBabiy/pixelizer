import * as express from 'express';
import * as path from 'path';
import * as fileUpload from 'express-fileupload';
import * as fs from 'fs-extra';
import { ImageController } from './controller';
import { logger } from './util/Utils';
import * as morgan from 'morgan';

(async () => {
    fs.emptyDirSync('./storage');

    const app: express.Application = express();
    const port = process.env.PORT || 3200;

    // Config
    app.use(fileUpload());
    app.use(express.static('public'));
    app.use(morgan('combined'))

    // Controllers
    app.use('/image', ImageController);

    app.listen(port, () => {
        logger.info(`Listening at http://localhost:${port}/`);
    });
})();