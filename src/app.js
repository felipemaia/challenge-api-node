const dbSetup = require('./db/db-setup')
const express = require('express')
const cors = require('cors')
const apiPublicRoutes = require('./routes/api/public')
const apiPrivateRoutes = require('./routes/api/private')

dbSetup();
const app = express()

//Allow POST / PUT parameters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api', apiPublicRoutes);
app.use('/api/admin', apiPrivateRoutes);

app.get('*', (req,res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || '8080')
