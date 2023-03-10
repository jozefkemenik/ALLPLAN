from bs4 import BeautifulSoup as bs 
from glob import glob
import re
import json
globalTransDict={}
xlfFiles =glob('../../**/src/i18n/**/*.xlf', recursive=True)
if(len(xlfFiles)==0):
    print('cannot find any xlf files under i18n directory, try to execute program from parent folder')
for xlfFile in xlfFiles:
    print('\n------------------------------------------------------')
    print('processing ' +xlfFile)
    res= re.search("[a-z]+.xlf", xlfFile,re.IGNORECASE)
    if(not(res)):
        print('failed! wrong file name')
        continue
    lang =res.group().split('.')[0]
    if(len(lang)!=2):
       print('skipping file! not real translations')
       lang='source'
       continue
    transDict={}
    with open(xlfFile,"r") as f:
        file = f.read()
        soup = bs(file, features="xml")
        for link in soup.find_all('unit'):
            value = link.find('target')
            if(value):
                value = value.text
            else:
                value = link.find('source').text
            transDict[link.attrs['id']]=value
        message = "found {} items".format(len(transDict.keys()))
        print(message)
        globalTransDict[lang]=transDict
print('\n------------------------------------------------------')
with open('../../src/assets/translations.json', 'w') as f:
    json.dump(globalTransDict, f,indent=2)
    print("New translation.json was created sucesfully")
print("\n")