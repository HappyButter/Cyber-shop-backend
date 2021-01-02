import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import mountRouter from './routes/index.js';

const port = 3000; // tmp port 4 production
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

mountRouter(app);

app.get('/', (req, res) => {
  res.send("Works");
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});


