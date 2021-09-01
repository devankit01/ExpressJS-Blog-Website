const mongoose = require('mongoose');

const dbConnect = async () => {
    try{
        const connected = await mongoose.connect(process.env.MONGODB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log("MongoDB Connected")

    } catch(err){
        console.log('Error : ', err.message)
    }
}

dbConnect();

module.exports = {dbConnect}