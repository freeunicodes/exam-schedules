import { indexRouter } from './routes'
import express from 'express'
import { filterRouter } from './routes/filters'


const app = express()
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use('/', indexRouter);
app.use('/filters/', filterRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(`Click to open: http://localhost:${port}`)
})

export default app
