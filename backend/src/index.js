import dotenv from 'dotenv'
import connectDB from './DataBase/db.js'
import { app } from './app.js'

dotenv.config({
    path: './.env'
})

connectDB()
.then(()=> {
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is runnig on port : ${process.env.PORT || 8000}`);
    }
)
    console.log("Database connection established successfully.");
    
})
.catch((Error) => {
    console.error("Error connection to sucessfully.", Error);
    
})