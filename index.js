const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const port = 3003;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public' )));
app.set('view engine','ejs');

dotenv.config();
const connectDB = async () => {
  try {
      await mongoose.connect(process.env.mongo_url)
      console.log(`DB Connected`);
      
  } catch (error) {
      console.log(`Error while connecting db ${error}`);
    }  
  }
  connectDB();
  const Owner = new mongoose.Schema({
    ownerName:{
      type:String,
      required:true
    },
    ownerNumber:{
      type:Number,
      required:true
    }
  });
  const Tenant = new mongoose.Schema({
    tenantName:{
      type:String,
      required:true
    },
    tenantNumber:{
      type:Number,
      required:true
    }
  });

  const tenantInfo =mongoose.models.tenantinfo || new mongoose.model('tenant-info',Tenant);
  const ownerInfo =mongoose.models.ownerinfo || new mongoose.model('owner-info',Owner);


  app.get('/',async (req,res)=>{
    const tasks= await tenantInfo.find({});
    const task2 = await ownerInfo.find({}); 

    res.render('home.ejs',{tasks,task2});
  })

  app.get('/tenant',async (req,res)=>{
    const tenantinfo = await tenantInfo.find({}); 
    res.render('index.ejs',{tenantinfo});
  })
  app.post('/tenant',async (req,res)=>{
    const {tname ,tnumber} = req.body;
    const newTask = new tenantInfo({ tenantName: tname, tenantNumber:tnumber });
    await newTask.save();
    res.redirect('/');
  });
  app.get('/owner',async (req,res)=>{
    const ownerinfo = await ownerInfo.find({}); 
    res.render('owner.ejs',{ownerinfo});
  })
  app.post('/owner',async (req,res)=>{
    const {oname ,onumber} = req.body;
    const newTask1 = new ownerInfo({ ownerName: oname, ownerNumber:onumber });
    await newTask1.save();
    res.redirect('/');
  });
  app.post('/delete-owner/:name',async (req,res)=>{
    await ownerInfo.findByIdAndDelete(req.params.name);
      res.redirect('/');
  })
  app.post('/delete-tenant/:sanidhya',async (req,res)=>{
    await tenantInfo.findByIdAndDelete(req.params.sanidhya);
      res.redirect('/');
  })


  app.get('/edit/edit-tenant/:filename', async (req, res) => {
  
      const task = await tenantInfo.findById(req.params.filename);
     
        res.render('edit.ejs', {task});
       
  });
  
  
  app.post('/edit/edit-tenant/:filename', async (req, res) => {
    try {
      const { tnameNew, tnumberNew } = req.body; 
      await tenantInfo.findByIdAndUpdate(req.params.filename, {
        tenantName: tnameNew,
        tenantNumber: tnumberNew,
      });
      res.redirect('/'); 
    } catch (err) {
      console.error(err);
      res.redirect('/'); 
    }
  });
  app.get('/edit/edit-owner/:filename', async (req, res) => {
   
      const task = await ownerInfo.findById(req.params.filename);
     
        res.render('edit-owner.ejs', { task }); 
     
  });
  
  
  app.post('/edit/edit-owner/:filename', async (req, res) => {
      const { onameNew, onumberNew } = req.body; 
      await ownerInfo.findByIdAndUpdate(req.params.filename, {
        ownerName: onameNew,
        ownerNumber: onumberNew,
      });
      res.redirect('/');
   
  });
  

  app.listen(`${port}`,()=>{
    console.log(`Server running on port ${port}`); 
  })