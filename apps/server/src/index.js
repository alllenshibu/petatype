const express = require('express');
const http = require('http');

const bodyParser = require('body-parser');
const cors = require('cors');
const { redis } = require('./config');

const soloRoutes = require('./routes/solo.routes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);

require('./routes/room.socket')(server)


app.use(cors());
app.use(bodyParser.json());

app.use('/text', require('./routes/text.route'));

app.use('/player', require('./routes/player.route'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.use('/solo', require('./routes/solo.routes'));

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
