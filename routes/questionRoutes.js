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
    // console.log(element);
    let element1=element.split(" ");
    map1.set(element1[0]+' '+element1[1],element1[2]);
    // console.log(map1.get(element1[0]+' '+element1[1]));
});

router.post('/',(req,res)=>{
    // console.log(req.body.query);
    const text=req.body.query;
    ////
    
    const extraction_result =
    keyword_extractor.extract(text,{
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: false
    });
    extraction_result.sort();
    // console.log(extraction_result);
    const word_count=extraction_result.length;
    let uniquefile = extraction_result.filter(function(element, index){
        return extraction_result.indexOf(element) === index;
    });
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
    let file_magnitute=0;
    let ans=[];

    uniquefile.forEach(element => {    
        const index=sentence.indexOf(uniquefile[j]);
        if(index !=-1){
            let val=uniquecount[j]/word_count;
            val=val*IDF[index];
            file_magnitute+=val;
            ans.push([index,val]);
            // console.log(uniquefile[j],val,index);
        }       
        j++;
    });
    let num=0;
    const page_no=2277;
    let simlarity=[];

    for(num=0;num<=page_no;num++){

        let product=0;
        ans.forEach((element)=>{
            index=element[0];
            val=element[1];
            // console.log(map1.get(num+' '+index));
            if(map1.has(num+' '+index)){
                // console.log('got it!!');
                product+=val*map1.get(num+' '+index);
            }
        });

        if((magnitude[num]*file_magnitute)!=0){
            simlarity.push([(product)/(magnitude[num]*file_magnitute),num]);
        }
    }
    // console.log(simlarity.length);
    // console.log(simlarity);
    simlarity.sort();
    let questions=[];
    const len=simlarity.length;
    let i=0;
    let questioncnt=1;
    for(i=len-1;i>=0&&i>=len-1-6;i--){
        let ok=simlarity[i];
        // console.log(ok[0]);
        val=ok[0];
        num=ok[1];
        questions.push({title:questioncnt+'. '+problemtitles[num],_id:num});
        questioncnt++;
        // console.log('done');
    }
    let cnt=0;
    problemtitles.forEach(element=>{
        ele=element.split(" ");
        let ok=0;
        for(ok=0;ok<ele.length;ok++){
            const index=uniquefile.indexOf(ele[ok].toLowerCase());
            if(index!=-1&&questions.length<=10){
                // console.log('found0');
                let flag=1;
                questions.forEach(element=>{
                    if(element._id==cnt){
                        flag=0;
                    }
                });
                // if(questions.indexOf({title:problemtitles[cnt],_id:cnt})==-1)CONTA{
                //     questions.push({title:problemtitles[cnt],_id:cnt});
                //     // console.log('found1');
                //     break;
                // }
                if(flag==1){
                    questions.push({title:questioncnt+'. '+problemtitles[cnt],_id:cnt});
                    questioncnt++;
                    break;
                }
            }
        }
        cnt++;
    });

    // if(questions.length==0){

    // }
    // questions=[{title:'0. Unique Paths II', _id:'0'}];
    res.render('search',{title:'search' ,questions:questions});
});



module.exports=router;

