const mongoose = require('mongoose')

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to Database ${conn.connection.host} `);
    } catch (err) {
        console.log(err);  
    }
}

module.exports = connectDB