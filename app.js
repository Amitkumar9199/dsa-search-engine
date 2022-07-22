const keyword_extractor = require("keyword-extractor");
const fs =require('fs');

const sentence1 =fs.readFileSync('./stopwords.txt','utf8');
const stopwords =
keyword_extractor.extract(sentence1,{
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: true

});
stopwords.sort();

num=0
pageno=2277
const allwords=[];

for (num=0;num<=pageno;num++){
    const sentence =fs.readFileSync('./problems/problem_text_'+(num)+'.txt','utf8');
    const extraction_result1 =
    keyword_extractor.extract(sentence,{
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: true

    });
    extraction_result1.forEach(element => {
        if(!allwords.includes(element)){
            if(!stopwords.includes(element)){
                allwords.push(element);
            }
        }
    });
    allwords.sort();
    const extraction_result2 =
    keyword_extractor.extract(sentence,{
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: false

    });
    const res=[]
    extraction_result2.forEach(element => {
        if(!stopwords.includes(element)){
            res.push(element);
        }
    });
    res.sort();
    // console.log(extraction_result1);
    file ="";
    res.forEach(element => {
            file=file+element+'\n';
    });
    fs.writeFile('./problemtext/problem_text_'+num+'.txt',file,(err)=>{
        if(err){
            console.log(err);
        }
    });
};

allwords.sort();
file ="";
allwords.forEach(element => {
        file=file+element+'\n';
});
fs.writeFile('keywords.txt',file,(err)=>{
    if(err){
        console.log(err);
    }
});
