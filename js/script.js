let foods = []
let sort_field = "name"
let sort = 1
let roll = 4 // how many products in the roll
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

    let searched_foods = searchValue !== "" ? foods.filter(food => food.name.toLowerCase().includes(searchValue)) ||
        foods.filter(food => food.id.toLowerCase().includes(searchValue)) : foods


    // Uncomment when tag Check Boxes will be done
    // let filteredTags = tagCheckBoxes.filter(tag => document.getElementById(tag).checked)
    // if (filteredTags !== 0) {
    //     searched_foods = searched_foods.filter(food => filteredTags.includes(food.tag))
    // }


    searched_foods.forEach(food => {

        if (counter < elementDisplay(roll)) {
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

function elementDisplay(roll) {
    if (window_width <= 480) {
        return roll / 2
    }
    return roll
}

function search(value) {
    searchValue = value.toLowerCase()
    displayTable()
}
