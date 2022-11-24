const deletes =(btn)=>{
    console.log(btn.parentNode.querySelector('[name=productId]').value);
    const prodId=btn.parentNode.querySelector('[name=productId]').value;
    const parentElement = btn.closest("article");
    console.log(parentElement);
    fetch('/admin/products/'+ prodId,{
        method:'delete'
    }).then(result=>{
        console.log("result,", result);
        return result.json();
    }).then(data=>{
        console.log(data);
        parentElement.parentNode.removeChild(parentElement);
    })
    .catch(err=>{
        console.log(err);
    })
}