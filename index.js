const express = require('express');
const dotenv = require('dotenv');
const Pool=require('pg').Pool;
dotenv.config();
const db=new Pool({
    host:process.env.POSTGRES_HOST,
    user:process.env.POSTGRES_USER,
    port:5432,
    password:process.env.POSTGRES_PASSWORD,
    database:process.env.POSTGRES_DATABASE
});

const app = express();
app.use(express.json());

app.post('/get_info',async (req,res)=>{
    const name=req.body.user_name;
    const ch=await db.query('select name from student_data where name= $1',[name]);
   
    if (ch.rows.length==0){
        console.log('No record for given data');
        res.json({message:"No record for given data"})
    }
    else if(ch.rows.length==1){
        console.log('Record present for given data');
        res.json({message:"Record present for given data"})
    }
    else{
        console.log("something wrong..");
    }
   
    
    
    
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(7000, process.env.IP_ADDRESS, () => {
    console.log(`Server is running on ` + process.env.IP_ADDRESS + ':7000');
});