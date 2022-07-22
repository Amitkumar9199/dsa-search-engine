const fs =require('fs');

const sentence1 =fs.readFileSync('keywords.txt','utf8');
const sentence=sentence1.split("\n");
const IDF1 =fs.readFileSync('IDF1.txt','utf8');
const IDF=IDF1.split("\n");


let idf="";
let len=0;

num=0;
pageno=2277;

let ans='';
let magnitude='';
i=0;
for (num=0;num<=pageno;num++){
    
    console.log(len);len++;

    const file1=fs.readFileSync('./problemtext/problem_text_'+num+'.txt','utf8');
    const file=file1.split("\n");
    const word_count=file.length;

    let uniquefile = file.filter(function(element, index){
        return file.indexOf(element) === index;
    });

    let uniquecount=[];
    uniquefile.forEach(element=>{
        let cnt=0;
        file.forEach(element2=>{
            if(element==element2){
                cnt++;
            }
        });
        uniquecount.push(cnt);
    });

    let TF='';
    let cnt=0;
    uniquefile.forEach(element=>{
        let var1=uniquecount[cnt]/word_count;
        TF=TF+element+' '+var1+'\n';
        cnt++;
    });
    fs.writeFile('./problemTF/problem_text_'+num+'.txt',TF,(err)=>{
        if(err){
            console.log(err);
        }
    });  

    let j=0;
    let file_magnitute=0;
    uniquefile.forEach(element => {    
        const index=sentence.indexOf(uniquefile[j]);
        if(index !=-1){
            let val=uniquecount[j]/word_count;
            val=val*IDF[index];
            
            if(val!=0){
                file_magnitute+=val;
                ans=ans+i+' '+index+' '+val+'\n';
            }
        }       
        j++;
    });
    magnitude=magnitude+file_magnitute+'\n';
    i++;
}

fs.writeFile('TFIDFMATRIX.txt',ans,(err)=>{
    if(err){
        console.log(err);
    }
});

fs.writeFile('Magnitude.txt',magnitude,(err)=>{
    if(err){
        console.log(err);
    }
});


