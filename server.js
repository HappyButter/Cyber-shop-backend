import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import mountRouter from './routes/index.js';

const port = 7312; // tmp port 4 production
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

mountRouter(app);

app.get('/', (req, res) => {
  res.send("Works");
})


app.listen(process.env.PORT || port, () => {
  console.log(`Server listening`)
})

