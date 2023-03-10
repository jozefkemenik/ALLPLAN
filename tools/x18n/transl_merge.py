
import json
globaDict={}
filename = '../../src/assets/translations.json'
try:
    with open(filename) as f:
        data = json.load(f)
except:
    print("cannot open file "  + filename)
    exit()
for lang in data:
    for key in data[lang]:
            if key not in globaDict.keys(): 
                globaDict[key]=data[lang][key] 

for lang in data:
    total=0
    print('\n------------------------------------------------------')
    print('processing '+ lang)
    for key in globaDict:   
        if key not in data[lang].keys(): 
            value=""
            total+=1
            if(lang=='en'):value+="*"+key
            else:
                if key in data['en'].keys(): value+=data['en'][key]+"_"+lang  
                else:  value+="*"+key+"_"+lang             
            data[lang][key]=value
            print('inserting the key: "'+key+ '" with value: ' +value)          
    if(total==0):print("OK - fully matched") 
    else:print("inserted: {}".format(total))
print('\n------------------------------------------------------')
print('sorting')
sortedData={}
for lang in data:
    sortedData[lang]={}
    for key in sorted(data[lang].keys(),key=lambda s: s.lower()):
        sortedData[lang][key]=data[lang][key]
print('sorted')
print('\n------------------------------------------------------')
with open(filename, 'w') as f:
    json.dump(sortedData, f,indent=2)
    print("The translation.json was updated")

    