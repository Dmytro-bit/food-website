let foods = []
let sort_field = "name"
let sort = 1

window.onload = () => {
    let url = "../data/foods.json";

    fetch(url)
        .then(response => response.json())
        .then(jsonData => {

            foods = jsonData
            displayTable()
        });
};

function displayTable() {
    let roll = 4 // how many products in the roll


    let htmlString = `<table><tr>`;
    let counter = 0

    foods.forEach(food => {

        if (counter < roll) {
            htmlString += `<td><div class="element"><div class="element_photo"></div>
                                <div class="element_info"><h1 style="padding: ${food.name.length <= 10 ? `0vw 0vw 2.5vw 0vw; ` : `0vw 0vw 1.5vw 0vw; `} font-size: 
                                ${food.name.length >= 17 ? `1.3vw` : `1.5vw`}">${food.name}</h1></div></div></td>`;
            counter++
        } else {
            htmlString += `<tr>`
            counter = 0
        }
    })
    htmlString += `</tr></table>`;
    document.getElementById("main_data").innerHTML = htmlString; // Fix: Set innerHTML property
}


function Sort(field) {
    sort_field = field
    sort *= -1;
    foods.sort((a, b) => a[field] < b[field] ? -sort : sort);
    displayTable();
}