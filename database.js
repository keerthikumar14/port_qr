const Pool=require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();
const db=new Pool({
    host:process.env.POSTGRES_HOST,
    user:process.env.POSTGRES_USER,
    port:5432,
    password:process.env.POSTGRES_PASSWORD,
    database:process.env.POSTGRES_DATABASE
});

db.connect();
async function fetch_data(reg_no){
    //console.log(reg_no);
    const aplnt=await db.query('select name,lunch_provided from student_data where reg_no= $1',[reg_no]);
   // console.log(aplnt.rows);
    if (aplnt.rows.length==0){
        return 'No record'
    }
    else if(aplnt.rows.length>0){
        return aplnt.rows[0];
    }
    else{
        return "something wrong.."
    }
  }

async function fetch_data_p(reg_id){
    const aplnt=await db.query('select name,lunch_provided,reg_no from participant_data where reg_id= $1',[reg_id]);
   
    if (aplnt.rows.length==0){
        return 'No record'
    }
    else if(aplnt.rows.length>0){
        return aplnt.rows[0];
    }
    else{
        return "something wrong.."
    }
  }

async function update_st(reg_no){
    const up=await db.query('UPDATE student_data SET lunch_provided = 1 WHERE reg_no = $1',[reg_no]);
    return up.rowCount;
}

async function update_st_p(reg_no){
    const up=await db.query('UPDATE participant_data SET lunch_provided = 1 WHERE reg_no = $1',[reg_no]);
    return up.rowCount;
}




module.exports={
    fetch_data,
    fetch_data_p,
    update_st,
    update_st_p
}



