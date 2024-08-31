const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');
process.on('Unhandled Rejection', (error)=>{
    console.log(error.name);
    console.log('Unhandled Rejection Occured: Shutting down...');
   
        process.exit(1);
    
    })
mongoose.connect(process.env.LOCAL).then((conn) => {
    console.log('Connection successfull');
}).catch((error) => {
    console.log('Some Error has occured')
});


app.listen(3000, () => {
    console.log('Server has started ...')
})

