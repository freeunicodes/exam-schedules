import { indexRouter } from './routes'
import express, {NextFunction, Request, Response} from 'express'
import { filterRouter } from './routes/filters'
import cors from 'cors'

const app = express()
const port = 3636;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())


app.use('/', indexRouter);
app.use('/filters/', filterRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(`Click to open: http://localhost:${port}`)
})

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    if (process.env.IN_GITHUB_ACTION === "YES") {
        console.log(err)
    }
    res.status(500).send(err.stack)
})

export default app