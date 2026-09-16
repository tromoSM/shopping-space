window.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('[contact]').forEach(contact=>{
        contact.addEventListener('click',function(){
            alert('test')
        })
        fetch('inventory/items.json').then(txt=>txt.json()).then(items=>{
            items.items.forEach((item,index)=>{
                document.querySelectorAll('items').forEach(itemA=>{
                    let itemd=document.createElement('item')
                    let im
                    if(item.images.length!=0){
                        im=document.createElement('img')
                        if(item.images[0].includes('[path:inventory]')){
                            im.src=item.images[0].replace('[path:inventory]','inventory/images/')
                        }
                        else{
                            im.src=item.images[0]
                        }
                        im.addEventListener('error',function(){
                            console.error(`image missing for "${items.name}(${index}) : image contains and error or is missing. (${im.src})"`)
                            newim=document.createElement('filler')
                            newim.setAttribute('filler','mainim')
                            newim.innerHTML=`<i class="bi bi-image-fill"></i>`
                            itemd.replaceChild(newim,im)
                        })
                    }
                    else{
                        console.error(`image missing for "${item.name}"(${index}) : no images in array`)
                        im=document.createElement('filler')
                        im.setAttribute('filler','mainim')
                        im.innerHTML=`<i class="bi bi-image-fill"></i>`
                    }
                    let name=document.createElement('p')
                    name.innerText=item.name

                    itemd.append(im,name)
                    itemA.append(itemd)
                })
            })
        })
    })
})