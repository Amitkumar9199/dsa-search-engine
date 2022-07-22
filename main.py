import time 
from selenium import webdriver
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())
urls = "https://leetcode.com/problemset/all/?page="
page_no=46#
cnt=46#
links=[]
names=[]
prob_name=[]
while cnt<=page_no:
    driver.get(urls+str(cnt))
    cnt+=1
    time.sleep(5)

    html=driver.page_source
    soup=BeautifulSoup(html,'html.parser')
    prob_name.append(soup.findAll('div',{"class":"odd:bg-layer-1 even:bg-overlay-1 dark:odd:bg-dark-layer-bg dark:even:bg-dark-fill-4"}))


for data1 in prob_name:
    for data in data1:
        links.append("https://leetcode.com"+data.find("a")['href'])
        name=data.find("a").get_text()
        names.append(name)

ok=0

with open("problem_urls.txt","w+") as f:
    while ok<len(links):
        f.write(links[ok]+"\n")
        ok+=1

ok=0
with open("problem_titles.txt","w+") as f:
    while ok<len(names):
        f.write(names[ok]+"\n")
        ok+=1

ok=0#
with open("links_names.txt","w+") as f:
    while ok<len(names):
        driver.get(links[ok])
        time.sleep(5)
        html=driver.page_source
        soup=BeautifulSoup(html,'html.parser')
        check=soup.find('div',{"class":"description_24sA"})
        if(check=="None"):
            prob_name="Premium_Question"
        else:
            prob_name=soup.find('div',{"class":"content__u3I1 question-content__JfgR"})
        with open("./problems/problem_text_"+str(ok+2251)+".txt","w+",encoding='utf-8') as g:#//utf is important
            g.write(str(prob_name))
        ok+=1

#https://stackoverflow.com/questions/27092833/unicodeencodeerror-charmap-codec-cant-encode-characters