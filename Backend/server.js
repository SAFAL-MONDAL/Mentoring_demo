const express = require('express');
const { connectToDatabase } = require('./config/db');
const { createMeeting } = require('./controllers/meetingController');
const app = express();
const router = require('./routes/routes')
const cors = require('cors');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

connectToDatabase();

app.get('/',(req,resp) => {
    console.log('server is running fit and fine')
    resp.send('server is running on port 4000')
})

//mentioning routes of the endpoints
app.use('/api',router)

const port = 4000;

app.listen(port,() => {
    console.log(`server started listening at port ${port}`)
})