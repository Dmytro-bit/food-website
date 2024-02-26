let foods = []
let sort_field = "name"
let sort = 1
let roll = 4 // how many products in the roll
let font_size = 1.3
let padding = 2.5
const window_width = window.screen.availWidth
let searchValue = ""
let all_tags = []
let tagCheckBoxes


window.onload = () => {
    let url = "../data/foods.json";

    fetch(url)
        .then(response => response.json())
        .then(jsonData => {

            foods = jsonData
            main()
        });
};

function main() {
    foods.forEach(food => food[`tags`] !== undefined ? food[`tags`].forEach(tag => all_tags.push(tag)) : null)
    tagCheckBoxes = [...new Set(all_tags)].sort()
    displayTable()

}


function displayTable() {


    let htmlString = `<table><tr>`;
    let counter = 0
    elementDisplay()
    foods.forEach(food => {
    let searched_foods = searchValue !== "" ? foods.filter(food => food.name.toLowerCase().includes(searchValue)) ||
        foods.filter(food => food.id.toLowerCase().includes(searchValue)) : foods


    // Uncomment when tag Check Boxes will be done
    // let filteredTags = tagCheckBoxes.filter(tag => document.getElementById(tag).checked)
    // if (filteredTags !== 0) {
    //     searched_foods = searched_foods.filter(food => filteredTags.includes(food.tag))
    // }


    searched_foods.forEach(food => {

        if (counter < roll) {
            htmlString += `<td><div class="element"><div class="element_photo"></div>
                                <div class="element_info"><h1 style="padding: ${food.name.length <= 10 ? `0vw 0vw ${padding}vw 0vw; ` : `0vw 0vw ${padding*0.85}vw 0vw; `} font-size: 
                                ${food.name.length >= 17 ? `${font_size}vw` : ''}">${food.name}</h1></div></div></td>`;
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

function elementDisplay() {
    if (window_width <= 480) {
        roll = 1
        font_size = 5
    }
}

function search(value) {
    searchValue = value.toLowerCase()
    displayTable()
}