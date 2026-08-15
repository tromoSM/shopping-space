import json
import os

loaded={}
with open(os.path.abspath(os.path.join('inventory','items.json')),'r') as item:
    list=json.load(item)
    for item in list.get('items'):
        print(item.get('name'))