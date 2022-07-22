const fs=require('fs');
let file=fs.readFileSync('IDF.txt','utf8');
file=file.split("\n");
let newfile="";
file.forEach(element => {
    let var1=parseFloat((element))+1;
    newfile=newfile+var1+"\n";
});
fs.writeFile('IDF1.txt',newfile,(err)=>{
    if(err){
        console.log(err);
    }
});