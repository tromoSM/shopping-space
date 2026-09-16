writer=1
reader=1
debug=True
print(f"""
┏━┓╻ ╻┏━┓┏━┓┏━┓╻┏┓╻┏━╸   ┏━┓┏━┓┏━┓┏━╸┏━╸
┗━┓┣━┫┃ ┃┣━┛┣━┛┃┃┗┫┃╺┓   ┗━┓┣━┛┣━┫┃  ┣╸ 
┗━┛╹ ╹┗━┛╹  ╹  ╹╹ ╹┗━┛   ┗━┛╹  ╹ ╹┗━╸┗━╸ v{writer}|{reader}
""")
if debug:
   print('*Debugshi')

def log(log,type="log",deb=False):
    if type!='log':
        log=f"[{type.upper()}] "+log
    if deb and not debug or not deb:
        print(log)

log('loading modules',deb=True)
try:
    import json
    import os
    from prettytable import PrettyTable
    import tkinter
    from tkinter import filedialog
    from pathlib import Path
    from shutil import copy2
    from random import choices
    from string import ascii_letters
    from rich.live import Live
    from rich.spinner import Spinner
    from time import sleep
    from datetime import datetime
    
except ModuleNotFoundError as er:
    log(f'Module not found : {er}','error')

log('loading menuitems',deb=True)
log('\n=== CHOOSE AN ACTION ===\n')
menu=[
   "see available items",
   "see available items (full)",
   "create new"
]
root=tkinter.Tk()
root.withdraw()

def today():
    now=datetime.now()
    month=now.month
    day=now.day
    if month<10:
        month=0+month
    if day<10:
        day=0+day
    return f'{month}/{day}/{now.year}'

defaultval={
    "name":'unnamed item',
    "price": 99999,
    "images":[],
    "description":""
}

menucount=1
for item in menu:
   log(f'[{menucount}] {item}')
   menucount+=1

while True:
    menuselected=input('Choose an action : ')
    if menuselected.isdigit() or menuselected.lower()=='exit':
        if menuselected.lower()=='exit':
            log('>> exiting action page')
            os._exit(1)
        break
    else:
        log('Value must be a number\n','error')

menuselected=int(menuselected)
selected=menu[menuselected-1]
if selected:
    log(f'>> [action] Chose action :{selected}')

    if menuselected==1 or menuselected==2:
        table=PrettyTable()
        if menuselected==1:
            table.field_names=["no","name","price"]
        else:
            table.field_names=["no","name","price","description"]

        loaded={}
        with open(os.path.abspath(os.path.join('inventory','items.json')),'r') as item:
            list=json.load(item)
            itemcount=1
            for item in list.get('items'):
                log(item.get('name'))
                mainrow=[
                     itemcount,
                     item.get('name','[name not found]'),
                     item.get('price','[price not found]')
                ]
                if menuselected==2:
                    mainrow.append(item.get('description','[description not found]'))
                table.add_row(mainrow)  
                itemcount+=1
        log(table)
    elif menuselected==3:
        currentinv={}
        iteminfo=[
            ["Item Name",'','name'],
            ["Price",'int','price'],
            ["Description",'','description'],
            ["Image",'img','images']
        ]
        with open(os.path.abspath(os.path.join('inventory','items.json')),'r') as items:
            currentinv=json.load(items)

        infodih={}
        
        for info in iteminfo:
            while True:
                if info[1]!='img':
                    q=input(info[2]+' : ')
                if info[1]=='' and q.replace(' ','')!='':
                    log(f'val : {q}\ncondition : passed/emptystring',deb=True)
                    infodih[info[2]]=q
                    break
                elif info[1]=='int' and q.isdigit():
                    log(f'val : {q}\ncondition : passed/digit',deb=True)
                    try:
                        infodih[info[2]]=int(q)
                        break
                    except ValueError:
                        pass
                elif info[1]=='img':
                      accepted=[('Image files','*.png *.jpg *.jpeg *.gif'),('Idgaf about my site so im gonna choose this','*.*')]
                      root.lift()
                      root.attributes('-topmost',True)
                      images=filedialog.askopenfilenames(filetypes=accepted,title='Select images of the item',defaultextension='.fluxlan')
                      if images:
                        currentdir=Path.cwd().resolve()
                        inventorypath=Path(currentdir)/'inventory'/'images'
                        log(f'current dir : {currentdir}')
                        relativepaths=[]
                        for image in images:
                            if Path(image).resolve().is_relative_to(inventorypath):
                                imtype='relative'
                            else:
                                imtype='static'
                                movepath=Path(inventorypath)/os.path.basename(image)
                                if not movepath.exists():
                                    copy2(image,movepath)
                                else:
                                    newpath=Path(inventorypath)/(str(infodih.get('name','unnameditem')).replace(' ','_')+'_'+''.join(choices(ascii_letters,k=20))+Path(image).suffix)
                                    log(f'creating new file in inventory : {newpath}')
                                    with open(newpath,'wb') as file:
                                        with open(image,'rb') as old:
                                            file.write(old.read())
                            relativepaths.append("[path:inventory]"+str(os.path.basename(image).replace(' ','%20')))
                            log(f'Image selected ({imtype}): {image}')

                        infodih[info[2]]=relativepaths
                        break
                      else:
                          noimg=input('No images selected. Do you want to continue? (yes/NO) : ')
                          noimg=noimg.lower().strip()
                          if noimg.startswith('y'):
                            print('Adding item without any images')
                            infodih[info[2]]=[]
                            break
                      root.update()
                      root.withdraw()

        finaltable=PrettyTable()
        finaltable.field_names=["info","value"]
        finaltable.align='l'
        for inn,val in infodih.items():
            old=type(val)
            if isinstance(val,tuple):
                infodih[inn]=val=list(val)
                log(f'converting object "{inn}" from {old} to {type(val)}')

            if type(val)==tuple or type(val)==list:
                val='\n'.join(val)

            if inn=='images':
                val.replace('[path:inventory]','')
                
            classtype=type(val)
            if classtype!=old:
                classtype=f'{type(val)}/{old}'
            log(f'InputSelected ({classtype}) | {inn}: {val}')

            finaltable.add_row([inn,val])
        print(finaltable)
        while True:
            confirmwrite=input('Do you want to add this item to the main inventory? (yes/NO) : ')
            confirmwrite=confirmwrite.lower().strip()
            if confirmwrite.startswith('y'):
                with Live(Spinner('bouncingBar',f'Adding "{infodih['name']}" to inventory...'),refresh_per_second=10):
                    with open(os.path.abspath(os.path.join('inventory','items.json')),'r') as inv:
                        current=json.load(inv)
                        for required,default in defaultval.items():
                            if infodih.get(required):
                                pass
                            else:
                                log(f'Creating default value for item : ({required}/{default})',type='warning')
                                infodih[required]=default

                        items=current.setdefault('items',[])
                        items.append(infodih)
                        current['last_updated']=today()
                        with open(os.path.abspath(os.path.join('inventory','items.json')),'w') as maininv:
                            json.dump(current,maininv,indent=3)

            else:
                log('>> exiting new item creation')
            break