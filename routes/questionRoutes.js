const fs=require('fs'); 
const express =require('express'); 
const router=express.Router();
const keyword_extractor=require("keyword-extractor"); 


//reading files
const sentence1 =fs.readFileSync('./data/keywords.txt','utf8');
const sentence=sentence1.split("\n");
const magnitude1 =fs.readFileSync('./data/Magnitude.txt','utf8');
const magnitude=magnitude1.split("\n");
const TFIDFMATRIX1 =fs.readFileSync('./data/TFIDFMATRIX.txt','utf8');
const TFIDFMATRIX=TFIDFMATRIX1.split("\n");
const IDF1 =fs.readFileSync('./data/IDF1.txt','utf8');
const IDF=IDF1.split("\n");
const problemtitles1 =fs.readFileSync('./data/problem_titles.txt','utf8'); 
const problemtitles=problemtitles1.split("\n");

router.use(express.urlencoded({extended:true})); 

let map1=new Map();
TFIDFMATRIX.forEach(element=>{
    let element1=element.split(" ");
    map1.set(element1[0]+' '+element1[1],element1[2]);
});

function jsondata(text){
    const extraction_result =
    keyword_extractor.extract(text,{
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: false
    });
    extraction_result.sort();
    const word_count=extraction_result.length;
    let uniquefile = extraction_result.filter(function(element, index){
        return extraction_result.indexOf(element) === index;
    });
    // unique words
    let uniquecount=[];
    uniquefile.forEach(element=>{
        let cnt=0;
        extraction_result.forEach(element2=>{
            if(element==element2){
                cnt++;
            }
        });
        uniquecount.push(cnt);
    });

    let j=0;
    let file_magnitute=0;//mod of vector<tfidf>
    let ans=[];//tfidf of query string
    uniquefile.forEach(element => {    
        const index=sentence.indexOf(uniquefile[j]);
        if(index !=-1){
            let val=uniquecount[j]/word_count;
            val=val*IDF[index];
            file_magnitute+=val;
            ans.push([index,val]);
        }       
        j++;
    });

    let num=0;
    const page_no=2277;
    let simlarity=[];
    //calculating simlarity with each file
    for(num=0;num<=page_no;num++){

        let product=0;
        ans.forEach((element)=>{
            index=element[0];
            val=element[1];
            if(map1.has(num+' '+index)){
                product+=val*map1.get(num+' '+index);//numerator part of dot product
            }
        });

        if((magnitude[num]*file_magnitute)!=0){
            simlarity.push([(product)/(magnitude[num]*file_magnitute),num]);//makin an simlarity array
        }
    }


    simlarity.sort();
    let questions=[];//will contain the json data
    const len=simlarity.length;
    let i=0;
    let questioncnt=1; 
    // getting questions with highest similarity
    for(i=len-1;i>=0&&i>=len-1-6;i--){
        let ok=simlarity[i];
        val=ok[0];
        num=ok[1];
        questions.push({title:questioncnt+'. '+problemtitles[num],_id:num});
        questioncnt++;
    }
    let cnt=0;
    let newquestions=[];
    // if query string matches witth question title and that question is not taken 
    problemtitles.forEach(element=>{
        ele=element.split(" ");
        let ok=0;
        for(ok=0;ok<ele.length;ok++){
            const index=uniquefile.indexOf(ele[ok].toLowerCase());
            
            if(index!=-1){
                let match=0;
                for(let ok1=0;ok1<ele.length;ok1++){
                    if(uniquefile.indexOf(ele[ok1].toLowerCase())!=-1){
                        match++;
                    }
                }
                let flag=1;
                
                questions.forEach(element=>{
                    if(element._id==cnt){
                        flag=0;
                    }
                });
                if(flag==1){
                    
                    newquestions.push([match,{title:'. '+problemtitles[cnt],_id:cnt}]);
                    // questioncnt++;
                    break;
                }
            }
        }
        cnt++;
    });
    newquestions.sort();
    for(let ok=newquestions.length-1;ok>=0&&ok>=newquestions.length-1-5;ok--){
        newquestions[ok][1].title=questioncnt+newquestions[ok][1].title;
        questions.push(newquestions[ok][1]);
        questioncnt++;
    }
    return questions;
};

router.post('/',(req,res)=>{        
    //query
    const text=req.body.query;
    
    //extracting required questions depending on query text
    const questions=jsondata(text); 
    //we take at max 13 results 

    // rendering the search page
    res.render('search',{title:'search' ,questions:questions,querystring:'"'+text+'"'});
});

module.exports=router;

