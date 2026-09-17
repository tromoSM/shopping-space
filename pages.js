window.openpage=(item,instant=false)=>{
    function sleep(dih){
        return new Promise(resolve=>setTimeout(resolve,dih))
    }
    console.log(`opening page:${item.id}`)
    fetch('inventory/items.json').then(raw=>raw.json()).then(async inventory=>{
        const main=inventory.items[Number(item.id)-1]
        console.log(`page info : ${main.name} (${main.price})`)
        document.querySelector('title').innerText=`${main.name.slice(0,1).toUpperCase()+main.name.slice(1)} - Shopping space`
        
        const maintab=document.createElement('fulltab')
        const mainvisualarea=document.createElement('flex')
        mainvisualarea.setAttribute('largearea','')
        const middledetailarea=document.createElement('infoarea')
        const head=document.createElement('h2')
        head.innerText=main.name
        const des=document.createElement('p')
        des.setAttribute('description','')
        des.innerText=main.description
        let preview
        if(main.images.length!=0){
            preview=document.createElement('img')
            preview.src=main.images[0]
            preview.addEventListener('error',function(){
                //errorshi
            })
        }
        else{
            //fallback
        }
        const price=document.createElement('p')
        price.setAttribute('price','')
        price.innerText=`${inventory.currency}${main.price}`
        const oldprice=document.createElement('span')
        oldprice.innerText=`${inventory.currency}${inventory.oldrate*main.price}`
        oldprice.setAttribute('old','')
        price.append(oldprice)
        middledetailarea.append(head,des)
        if(main.features&&main.features?.length!=0){
            const featuretable=document.createElement('features') 
            Object.entries(main.features).forEach(([feature,val])=>{
                const eachfeature=document.createElement('p')
                const label=document.createElement('span')
                label.setAttribute('featurehead','')
                label.innerText=feature
                const vall=document.createElement('span')
                vall.innerText=val
                eachfeature.append(label,vall)
                featuretable.append(eachfeature)
            })
                const colorcont=document.createElement('p')
                const label=document.createElement('span')
                label.setAttribute('featurehead','')
                label.innerText='colors'
                const colors=document.createElement('span')
                main.colors.forEach(color=>{
                    const supported_colors={
                        red:"red",
                        blue:"#0064ff",
                        green:"#08ff00",
                        orange:"#ff6000",
                        yellow:"#fffb00",
                        jelly:"#8bff00",
                        aqua:"#00ffc3",
                        lightblue:"#00dbff",
                        purple:"#a300ff",
                        lightpurple:"#cc72ff",
                        lightpink:"#ff72e9",
                        pink:"#ff00d7",
                        cherry:"#ff0078",
                        white:"white",
                        black:"black",
                        grey:"rgb(41, 41, 41)",
                        lightgrey:"rgb(158, 158, 158)",
                        transparent:"transparent"
                    }
                    const badge=document.createElement('color')
                    if(supported_colors[color]){
                        badge.setAttribute('supported','')
                        badge.style.background=supported_colors[color]
                        if(color=='transparent'){
                            badge.setAttribute('transparent','')
                        }
                    }
                    else{
                        badge.innerText=color
                    }
                    colors.append(badge)
                })
                colorcont.append(label,colors)
                featuretable.append(colorcont)
            middledetailarea.append(featuretable)
        }
        middledetailarea.append(price)
        const deliveryarea=document.createElement('deliveryarea')
        const deliveryinfo=document.createElement('delivery')
        if(main.delivery){
            const delinfo=document.createElement('p')
            delinfo.setAttribute('phead','')
            delinfo.innerText='Delivery information'
            const delinfolist=[`<i class="bi bi-geo-alt-fill"></i><span xt>from</span> : ${main.delivery.from}`,
            `<i class="bi bi-calendar-date"></i><span xt>Get by</span> : ${main.delivery.duration}`,
            `<i class="bi bi-cash-coin"></i><span xt>Delivery fee</span> : ${main.delivery.fee}`,
            `<i class="bi bi-truck"></i><span xt>Delivery company</span> : ${main.delivery.company}`
            ]
            delinfolist.forEach(del=>{
                const delinfop=document.createElement('delcol')
                delinfop.innerHTML=del
                deliveryinfo.append(delinfop)
            })
            
        }
        else{
            deliveryinfo.innerText='delivery information unavailable'
        }
        deliveryarea.append(deliveryinfo)
        const mainbuttons=document.createElement('maincontrols')
        const buynow=document.createElement('button')
        const addtocart=document.createElement('button')
        buynow.innerText='Buy now'
        buynow.setAttribute('buy','')
        addtocart.setAttribute('cart','')
        addtocart.innerHTML='<i class="bi bi-cart3"></i> Add to cart'
        buynow.addEventListener('click',function(){
            alert('this action isnt available yet')
        })
        addtocart.addEventListener('click',function(){
            alert('this action isnt available yet')
        })
        mainbuttons.append(buynow,addtocart)
        middledetailarea.append(mainbuttons)
        mainvisualarea.append(preview,middledetailarea,deliveryarea)
        maintab.append(mainvisualarea)

        if(!instant){
            maintab.setAttribute('notready','')
            document.body.append(maintab)
            await sleep(500)
            maintab.removeAttribute('notready')
        }
        else{
            maintab.setAttribute('instant','')
            document.body.append(maintab)
        }
    })
}