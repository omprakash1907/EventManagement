const express = require('express')
const connectDB = require('./config/db')
const Config = require('./config')
const cors = require('cors');
const authRouter = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const PORT = Config.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('Started Succefully..')
});
// Routes
app.use('/api/auth', authRouter);

app.listen(PORT, (err) => {
    if(err){
        console.log(err, 'server is not Connected')
    }
    connectDB();
    console.log(`listening on port : http://localhost:${PORT}`);
})
