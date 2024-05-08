const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

const authRoute = require('./routes/auth.route');
const profileRoute = require('./routes/profile.route');
app.use('/api', authRoute);
app.use('/api', profileRoute);


app.listen(port, (err)=>{
	if(err){
		process.exit(1);
	}
	console.log('Server running on port ${port}');
});
