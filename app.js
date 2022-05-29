const fs = require('fs');
const express = require('express');
const app = express();
const questionRoutes=require('./routes/questionRoutes.js');

const port =process.env.PORT || 3000;

const title=fs.readFileSync('./data/problem_titles.txt','utf8');
const title1=title.split("\n");
const url=fs.readFileSync('./data/problem_urls.txt','utf8');
const url1=url.split("\n");
// to get read data from form 
app.use(express.urlencoded({extended:true}));

//set up template engine
app.set('view engine','ejs');

//static files
app.use('/assets',express.static('./public/assets'));

app.listen(port);

app.get('/',(req,res)=>{
    // console.log(req.url);
    res.render('index',{title:'home'})
});

app.get('about-us',(req,res)=>{
    res.redirect('/about',{title:'About-us'});
});

app.get('/about',(req,res)=>{
    res.render('about',{title :'About'});
});
app.get('/contact',(req,res)=>{
    res.render('contact',{title :'contact us'});
});

app.get('/details/:id',(req,res)=>{
    const id=req.params.id;
    // console.log(id);
    const body1=fs.readFileSync('./data/problems/problem_text_'+id+'.txt');
    file={title:title1[id],url:url1[id],body:body1};
    res.render('details',{title:'question details',blog:file});
});

app.use('/question',questionRoutes);
app.use((req,res)=>{
    res.status(404).render('404',{title:'404'});
});

