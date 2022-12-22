const express = require('express')
const app = express()
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));


import indexRouter from './routes'

let filterRouter = require('./routes/filters')

app.use('/', indexRouter.router);
app.use('/filters/', filterRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
