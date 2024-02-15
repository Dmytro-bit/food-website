products = [{name:"Carrot", calories:10, color:"Orange"},
            {name:"Potatoe", calories:15, color:"Yellow"},
            {name:"Cucumber", calories:9, color:"Green"},
            {name:"Tomatoe", calories:12, color:"Red"},
            {name:"Pepper", calories:8, color:"Red"}]


const ASCENDING = 1
let sortDirection = ASCENDING

function DisplayTable()
{  
    let htmlStr = `<table id="main_tbl"><tr>`

    products.forEach(product => htmlStr += `<td><div id="obj"><div id="photo"></div><div id="obj_info"><h1>${product.name}</h1>
                                                                                                  <h1>${product.calories}</h1>
                                                                                                  <h1>${product.color}</h1></div></div></td>`)

    htmlStr += `</tr></table>`
    document.getElementById("tbl").innerHTML = htmlStr
    console.log(htmlStr)
}

function Sort()
{
    products.sort((a,b) => a.name < b.name ? -sortDirection:sortDirection)
    sortDirection*=-1
    DisplayTable()
}

function CreateObject()
{

}