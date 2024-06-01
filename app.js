const express = require('express');
const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('config/cert.key'),
  cert: fs.readFileSync('config/cert.crt'),
};
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());
const { fetch_data,fetch_data_p,update_st,update_st_p} = require('./database.js');


app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/get_data',async (req,res)=>{
    const dt=req.body.user_id;
    const rs=await fetch_data(dt);
    if(rs=="No record"){
        const rg=await fetch_data_p(dt);
        res.json({ message:rg.lunch_provided,idn:dt,nm:rg.name,ord_id:rg.reg_no});
    }
    else{
        res.json({ message:rs.lunch_provided,idn:dt,nm:rs.name});
        
    }
    
});

app.post('/get_info',async (req,res)=>{
    const dt=req.body.user_id;
    const rs=await fetch_data(dt);
    if(rs=="No record"){
        const rg=await fetch_data_p(dt);
        res.redirect('/show_data_p/'+rg.lunch_provided+'&'+dt+"&"+rg.name+"&"+rg.reg_no);
    }
    else{
        res.redirect('/show_data/'+rs.lunch_provided+'&'+dt+"&"+rs.name);
        
    }
    
    
    
});

app.get('/show_data/:lp&:rg&:nm',(req,res)=>{
     const dt=req.params.lp;
     const nm=req.params.nm;
     var rg=req.params.rg;
     var ff="";
     if(dt==0){
         ff="Not provided";
         res.render('conform.ejs',{id:ff,rg:rg,n:nm});
     }
     else if(dt==1){
         ff="Provided";
         rg='';
         res.render('conform.ejs',{id:ff,rg:rg,n:nm});
     }
     else{
         ff=dt;
         rg='';
         res.render('conform.ejs',{id:ff,rg:rg,n:nm});
     }
    
 });

app.get('/show_data_p/:lp&:rg&:nm&:od',(req,res)=>{
    const dt=req.params.lp;
    const nm=req.params.nm;
    const od=req.params.od;
    var rg=req.params.rg;
    var ff="";
    if(dt==0){
        ff="Not provided";
        res.render('conform_.ejs',{id:ff,rg:rg,n:nm,od:od});
    }
    else if(dt==1){
        ff="Provided";
        rg='';
        res.render('conform_.ejs',{id:ff,rg:rg,n:nm,od:od});
    }
    else{
        ff=dt;
        rg='';
        res.render('conform_.ejs',{id:ff,rg:rg,n:nm,od:od});
    }
    
});

app.post('/change_state',async (req,res)=>{
    const rn=req.body.reg_no;
    const rs=await update_st(rn);
    if(rs>0){
        res.redirect('/');
    }

});

app.post('/change_state_p',async (req,res)=>{
    const rn=req.body.reg_no;
    const rs=await update_st_p(rn);
    if(rs>0){
        res.redirect('/');
    }

});






app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


https.createServer(options,app).listen(8000, process.env.IP_ADDRESS, () => {
    console.log(`Server is running on ` + process.env.IP_ADDRESS + ':8000');
});