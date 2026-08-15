window.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('[contact]').forEach(contact=>{
        contact.addEventListener('click',function(){
            alert('test')
        })
        fetch('inventory/items.json').then(txt=>txt.json()).then(items=>{
            items.items.forEach(item=>{
                document.querySelectorAll('items').forEach(itemA=>{
                    let itemd=document.createElement('item')
                    let im=document.createElement('img')
                    im.src=item.images[0]
                    let name=document.createElement('p')
                    name.innerText=item.name

                    itemd.append(im,name)
                    itemA.append(itemd)
                })
            })
        })
    })
})