window.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('[contact]').forEach(contact=>{
        contact.addEventListener('click',function(){
            alert('palayan pako yanna')
        })
        fetch('inventory/items.json').then(txt=>txt.json()).then(items=>{
            items.items.forEach(item=>{
                console.log(`${item.name} : ${item.description}`)
            })
        })
    })
})