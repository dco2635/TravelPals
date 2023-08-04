import express from 'express';

import path from 'path';
import {fileURLToPath} from 'url';
import configRoutes from './routes/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import router from './routes/register.js';

const app = express();


app.use(express.json());

app.use("/", router);

app.use(
  '/static',
  express.static(path.join(__dirname, 'public')),
);

app.set('view engine', 'pug');
configRoutes(app)
const port = 3000;

app.listen(port, () => {
  console.log('Your routes will be running on http://localhost:3000');
});
