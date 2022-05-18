const express = require('express')
const app = express()
const port = 3000
const routerProducer = require('./producer');
const subscribeSQS = require('./consumer');

app.use(express.json());
app.use('/producer', routerProducer);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => {
  subscribeSQS.start();
  console.log(`Example app listening on port ${port}!`)
})