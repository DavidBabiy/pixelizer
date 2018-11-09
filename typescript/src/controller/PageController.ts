import { Router } from 'express';
import * as path from "path";

const router: Router = Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

export const PageController: Router = router;