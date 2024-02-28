let foods = []
let sort_field = "name"
let sort = 1
let roll = 4 // how many products in the roll
let adaptive_font_size = 1.3
let adaptive_padding = 2.5
const window_width = window.screen.availWidth
let searchValue = ""
let tagCheckBoxes
let filter_displayed = false;
let sort_displayed = false;
let menu_displayed = false;
let unique_nutrition_values
let nutrition_values = []
let order = 1;

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
    let all_tags = []
    foods.forEach(food => food[`tags`] !== undefined ? food[`tags`].forEach(tag => all_tags.push(tag)) : null)
    tagCheckBoxes = [...new Set(all_tags)].sort()

    foods.forEach(element => {
        let nutrition_key_g = element["nutrition-per-100g"]
        if(nutrition_key_g){
            Object.keys(nutrition_key_g).forEach(key => {
                nutrition_values.push(key)
            })
        }
    })        
    unique_nutrition_values = [...new Set(nutrition_values)].sort()
    
    console.log(nutrition_values)
    console.log(unique_nutrition_values)

    let filter_content = ``
    tagCheckBoxes.forEach(checkbox => {

        filter_content += `<li><input type="checkbox" class="filter_option" id="${checkbox}" oninput="displayTable()">${checkbox}</li>`
        // console.log(htmlString)

        document.getElementById("filter_list").innerHTML = filter_content
    })

    let sort_content = ``
    unique_nutrition_values.forEach(checkbox =>
        {
            sort_content += `<li><div class="sort_option" id="${checkbox}" onclick="sortNutrition()">${checkbox}</div></li>`
            document.getElementById("sort_list").innerHTML = sort_content
        })
    displayTable()

}


function displayTable() {
    let htmlString = `<table><tr>`;
    let counter = 0
    elementDisplay()

    let searched_foods = searchValue !== "" ? foods.filter(food => food.name.toLowerCase().includes(searchValue)) ||
        foods.filter(food => food.id.toLowerCase().includes(searchValue)) : foods


    // Uncomment when tag Check Boxes will be done
    let filteredTags = tagCheckBoxes.filter(tag => document.getElementById(tag).checked)
    let final_foods = [...searched_foods]
    console.log(filteredTags)

    if (filteredTags.length !== 0) {
        final_foods = []
        for (let food of searched_foods) {
            for (let tag of filteredTags) {
                if (food.tags !== undefined && food.tags.includes(tag)) {
                    final_foods.push(food)
                    console.log(food)
                }
            }
        }
    }

    final_foods.forEach(food => {
        if (counter >= roll) {
            htmlString += `<tr>`
            counter = 0
        }
        htmlString +=   `<td>
                            <div class="element"><div class="element_buttons_menu" id="${food.id}_buttons">
                                    <div class="element_button" id="view"><img src="../icons/info.png" class="element_button_icon"></div>
                                    <div class="element_button" id="edit"><img src="../icons/pencil.png" class="element_button_icon"></div>
                                    <div class="element_button" id="delete"><img src="../icons/bin.png" class="element_button_icon"></div>
                                </div>
                                <div class="element_object" onclick="displayMenuButtons('${food.id}')">
                                    <div class="element_photo"></div>
                                    <div class="element_info">
                                        <h1 style="padding: ${food.name.length <= 10 ? `0vw 0vw ${adaptive_padding}vw 0vw; ` : `0vw 0vw ${adaptive_padding * 0.85}vw 0vw; `} font-size: 
                                        ${food.name.length >= 17 ? `${adaptive_font_size}vw` : ''}">${food.name}</h1>
                                    </div>
                                </div>
                            </div>
                        </td>`;
        counter++

    })
    htmlString += `</tr></table>`;
    document.getElementById("main_data").innerHTML = htmlString; // Fix: Set innerHTML property
}


function sortNutrition(){
    
    let ascendingOrder = unique_nutrition_values.sort((a, b) => (order === 1 ? a - b : b - a));
    order *= -1
    
    displayTable()
}

function elementDisplay() {
    if (window_width <= 480) {
        roll = 1
        adaptive_font_size = 5
    }
}

function search(value) {
    searchValue = value.toLowerCase()
    displayTable()
}

function displayFilter() {
    if (!filter_displayed) {
        document.getElementById("filter_list").style.display = 'block'
        filter_displayed = true
    } else {
        document.getElementById("filter_list").style.display = 'none'
        filter_displayed = false
    }
}

function displaySort() {
    if (!sort_displayed) {
        document.getElementById("sort_list").style.display = 'block'
        sort_displayed = true
    } else {
        document.getElementById("sort_list").style.display = 'none'
        sort_displayed = false
    }
}


function displayMenuButtons(id){
    console.log(id)
    if(!menu_displayed)
    {
        document.getElementById(id+"_buttons").style.margin = `15vh 0 0 -4rem`        
        menu_displayed = true
    }
    else
    {
        document.getElementById(id+"_buttons").style.margin = `15vh 0 0 10rem`
        menu_displayed = false
    }
}

function displayModal()
{
    
}