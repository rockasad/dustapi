// Header
const express = require('express');
const cors = require("cors");
const config = require('./util/config');
const app = express();
const port = config.PORT;

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cors());
app.use(express.json());

const airRoute = require('./routes/log/log');
app.use('/log', airRoute);

app.listen(port, () =>
    console.log(`dust-restapi app listening on port ${port}!`)
);