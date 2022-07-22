const fs =require('fs');

const sentence1 =fs.readFileSync('keywords.txt','utf8');

sentence=sentence1.split("\n");

let idf="";
let len=0;
sentence.forEach(element => {
    console.log(len);
    len++;
    num=0;
    pageno=2277;
    cnt=0;
    for (num=0;num<=pageno;num++){
        const file=fs.readFileSync('./problemtext/problem_text_'+num+'.txt','utf8');
        if (file.includes(element)){
            cnt++;
        }
    }
    let val=1+Math.log(2278/cnt)/Math.log(10);
    idf=idf+val+'\n';
});

fs.writeFile('IDF.txt',idf,(err)=>{
    if(err){
        console.log(err);
    }
});
