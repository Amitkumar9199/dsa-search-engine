ok=1
allwords=[]
while(ok<=5):
    text_file = open('./problems/problem_text_'+str(ok)+'.txt', 'r')
    text = text_file.read()
    ok+=1
    
    #cleaning
    text = text.lower()
    words = text.split()
    words = [word.strip('.,!;()[]<>/\\*&-+=%$#@~`^?\{\}|()0123456789:') for word in words]
    words = [word.replace("'s", '\n') for word in words]
    words = [word.replace("<", '\n') for word in words]
    words = [word.replace(">", '\n') for word in words]
    words = [word.replace("/", '\n') for word in words]
    words = [word.replace("=", '\n') for word in words]
    words = [word.replace("\"", '\n') for word in words]
    words = [word.replace("_", '\n') for word in words]
    words = [word.replace("]", '\n') for word in words]
    words = [word.replace("[", '\n') for word in words]
    words = [word.replace(".", '\n') for word in words]
    words = [word.replace("-", '\n') for word in words]
    words = [word.replace(";", '\n') for word in words]
    words = [word.replace("\{", '\n') for word in words]
    words = [word.replace("\}", '\n') for word in words]
    words = [word.replace("|", '\n') for word in words]
    words = [word.replace(":", '\n') for word in words]
    words = [word.replace("(", '\n') for word in words]
    words = [word.replace(")", '\n') for word in words]

    #finding unique
    unique = []
    for word in words:
        if word=='\n':
            continue
        if word not in unique:
            unique.append(word)

    #sort
    unique.sort()

    for word in unique:
        if word not in allwords:
            allwords.append(word)

    allwords.sort()

    #print
    # print(unique)
    with open('./problemtext/problem_text_'+str(ok-1)+'.txt','w+') as f:
        for ok1 in unique:
            f.write(ok1+"\n")

with open('keywords.txt','w+') as g:
    for ok1 in allwords:
        g.write(ok1+'\n')
