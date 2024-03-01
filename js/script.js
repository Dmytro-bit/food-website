let foods = []
let roll = 4 // how many products in the roll
let adaptive_font_size = 1.3
let adaptive_padding = 2.5
const window_width = window.screen.availWidth
let searchValue = ""
let tagCheckBoxes
let filter_displayed = false;
let sort_displayed = false;
let menu_displayed = false;
let last_menu_id_displayed
let unique_nutrition_values
let nutrition_values = []
let order = 1;
let executableID
let modalActvie = false;

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
        if (nutrition_key_g) {
            Object.keys(nutrition_key_g).forEach(key => {
                nutrition_values.push(key)
            })
        }
    })
    unique_nutrition_values = [...new Set(nutrition_values)].sort()


    let filter_content = ``
    tagCheckBoxes.forEach(checkbox => {

        filter_content += `<li><input type="checkbox" class="filter_option" id="${checkbox}" oninput="displayTable()">${checkbox}</li>`

        document.getElementById("filter_list").innerHTML = filter_content
    })

    let sort_content = ``
    unique_nutrition_values.forEach(checkbox => {
        sort_content += `<li><div class="sort_option" id="${checkbox}" onclick="sortNutrition('${checkbox}')">${checkbox}</div></li>`
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

    if (filteredTags.length !== 0) {
        final_foods = []
        for (let food of searched_foods) {
            for (let tag of filteredTags) {
                if (food.tags !== undefined && food.tags.includes(tag)) {
                    final_foods.push(food)
                }
            }
        }
    }

    final_foods.forEach(food => {
        if (counter >= roll) {
            htmlString += `<tr>`
            counter = 0
        }
        htmlString += `<td>
                            <div class="element"><div class="element_buttons_menu" id="${food.id}_buttons">
                                    <div class="element_button" id="view" onclick="viewModal(foodInfo('${food.id}'))"><img src="../icons/info.png" class="element_button_icon" alt="view"></div>
                                    <div class="element_button" id="edit" onclick="editModal(foodInfo('${food.id}'))"><img src="../icons/pencil.png" class="element_button_icon" alt="edit"></div>
                                    <div class="element_button" id="delete"><img src="../icons/bin.png" class="element_button_icon" alt="delete" onclick="deleteFood('${food.id}')"></div>
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


function sortNutrition(value) {
    foods.sort((a, b) => {
        const aValue = (a["nutrition-per-100g"] && a["nutrition-per-100g"][value]) || 0;
        const bValue = (b["nutrition-per-100g"] && b["nutrition-per-100g"][value]) || 0;

        return order * (aValue - bValue);
    });

    order *= -1;
    displayTable();
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


function displayMenuButtons(id) {
    executableID = id;
    if (menu_displayed === true && id !== last_menu_id_displayed) {
        if (document.getElementById(last_menu_id_displayed + "_buttons") !== null) {
            document.getElementById(last_menu_id_displayed + "_buttons").style.margin = `15vh 0 0 10rem`
        }
        menu_displayed = false
    }
    if (!menu_displayed) {
        document.getElementById(id + "_buttons").style.margin = `15vh 0 0 -4rem`
        menu_displayed = true
        last_menu_id_displayed = id
    } else {
        document.getElementById(id + "_buttons").style.margin = `15vh 0 0 10rem`
        menu_displayed = false
    }
}


function deleteFood(id) {
    let selectedIndex
    let foodName
    foods.forEach((food, index) => {
        if (food.id === id) {
            selectedIndex = index
            foodName = food.name
        }
    })
    if (window.confirm(`Do you want to delete: ${foodName}`)) {
        foods.splice(selectedIndex, 1)
        displayTable()
    }


}

function foodInfo(id) {
    let searchedFood
    for (let food of foods) {
        if (food.id === id) {
            searchedFood = food
            break
        }
    }
    return searchedFood
}

function viewModal(food) {

    if(!modalActvie) {
        modalActvie = true
        document.getElementById("modal").style.display = 'flex'

        let objKeys = Object.keys(food)
        let nutrKeys = food["nutrition-per-100g"] !== undefined ? Object.keys(food["nutrition-per-100g"]) : Object.keys(food["nutrition-per-100ml"])
        let content = ``

        objKeys.forEach(key =>
        {
            if(key === "nutrition-per-100g")
            {
                content += `<ul>`
                nutrKeys.forEach(key =>
                {
                    content += `<li><label><b>${key}</b></label><input type="text" value="${food["nutrition-per-100g"][key]}"></li>`
                })
                content += `</ul>`
            }
            else
            {
                content += `<li><label><b>${key}</b></label><input type="text" value="${food[key]}" ></li>`
            }

        })

        document.getElementById("view_content").innerHTML = content
    }

}

function editModal(food) {
    if(!modalActvie) {
        document.getElementById("modal").style.display = "flex"
        document.getElementById("save_edit").style.display = "block"
        modalActvie = true

        let objKeys = Object.keys(food)
        let nutrKeys = food["nutrition-per-100g"] !== undefined ? Object.keys(food["nutrition-per-100g"]) : Object.keys(food["nutrition-per-100ml"])
        let content = ``

        objKeys.forEach(key =>
        {
            if(key === "nutrition-per-100g" || key === "nutrition-per-100ml")
            {
                content += `<ul>`
                nutrKeys.forEach(key =>
                {
                    content += `<li><label><b>${key}</b></label><input type="text" id="${food.id}_${key}_edit" value="${food["nutrition-per-100g"][key]}"></li>`
                })
                content += `</ul>`
            }
            else
            {
                content += `<li><label><b>${key}</b></label><input type="text" id="${food.id}_${key}_edit" value="${food[key]}"></li>`
            }
        })

        document.getElementById("view_content").innerHTML = content
    }
}   

function saveEdit() {

    foods.forEach(food => {
        if (food.id === executableID) {
            let objKeys = Object.keys(food)
            let nutrKeys = Object.keys(food["nutrition-per-100g"])
            console.log(nutrKeys)
            objKeys.forEach(key => {
                if (key !== "nutrition-per-100g" && key !== "nutrition-per-100ml") {
                    food[key] = document.getElementById(food.id + "_" + key + "_edit").value
                    document.getElementById(food.id + "_" + key + "_edit").value = null
                } else if (key === "nutrition-per-100g") {
                    nutrKeys.forEach(key => {
                        console.log(document.getElementById(food.id + "_" + key + "_edit"))
                        food["nutrition-per-100g"][key] = document.getElementById(food.id + "_" + key + "_edit").value
                        document.getElementById(food.id + "_" + key + "_edit").value = null
                    })
                } else {
                    nutrKeys.forEach(key => {
                        food["nutrition-per-100ml"][key] = document.getElementById(food.id + "_" + key + "_edit").value
                        console.log(document.getElementById(food.id + "_" + key + "_edit"))
                        document.getElementById(food.id + "_" + key + "_edit").value = null
                    })
                }

            })
        }
        document.getElementById("modal").style.display = "none"
        document.getElementById("save_edit").style.display = "none"
        modalActvie = false;
    })
    displayTable()

}
function closeModal()
{
    if(modalActvie)
    {
        document.getElementById("modal").style.display = "none"
        document.getElementById("save_edit").style.display = "none"
    }
    modalActvie = false
}

function addNutrition() { // change list.children.length
    let listItem = document.createElement("li");  //https://www.w3schools.com/jsref/dom_obj_li.asp or https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_li_create
    let list = document.getElementById("nutrition_ul")
    listItem.innerHTML = `
        <li><label><b>Name</b></label><input type="text" value="" id="add_nutrition_name_${list.children.length}">
                       <label><b>Value</b></label><input type="text" value="" id="add_nutrition_value_${list.children.length}">
                       <input type="button" value="Add" onclick="addNutrition()">
                       <input type="button" value="Delete" onclick="deleteNutrition()"></li>
    `// https://www.w3schools.com/jsref/prop_element_childelementcount.asp
    list.appendChild(listItem);
}

function deleteNutrition() { // https://www.w3schools.com/jsref/met_node_removechild.asp
    let nutritionList = document.getElementById("nutrition_ul")

    if (nutritionList.children.length > 0) {
        nutritionList.removeChild(nutritionList.lastElementChild); //change when the ID is implemented
    }
}

function addTags() {
    let itemLIst = document.createElement("li")
    let list = document.getElementById("tags_ul")
    let tagsAvailable = ["None"]
    tagCheckBoxes.forEach(tag => tagsAvailable.push(tag))

    let htmlString = `<li><label><b>Choose tag: </b></label><select name="tags" id="add_food_tag_${list.children.length}">`

    tagsAvailable.forEach(tag => htmlString += `<option value="${tag}">${tag}</option>`)

    htmlString += `</select><input type="button" value="Add" onclick="addTags()"><input type="button" value="Delete" onclick="deleteTags()"></li>`
    itemLIst.innerHTML = htmlString
    list.appendChild(itemLIst)

}

function deleteTags() {
    let tags = document.getElementById("tags_ul")
    tags.removeChild(tags.lastElementChild)
}


function displayAdd() {
    let tagsAvailable = ["None"]
    tagCheckBoxes.forEach(tag => tagsAvailable.push(tag))
    let htmlString = ``

    htmlString += `<ul><li><label><b>Name</b></label><input type="text" id="add_food_name"></li></ul>`
    htmlString += `<ul id="nutrition_ul"><b>Nutrition</b>`


    htmlString += `<li><label><b>Name</b></label><input type="text" value="" id="add_nutrition_name_1">
                       <label><b>Value</b></label><input type="text" value="" id="add_nutrition_value_1">
                       <input type="button" value="Add" onclick="addNutrition()">
                       <input type="button" value="Delete" onclick="deleteNutrition()"></li>
                       `
    htmlString += `</ul>`

    htmlString += `<ul id="tags_ul"><b>Tags</b>`

    // for (let i = 0; i < num_tags; i++) {
    //     htmlString += `<li><label><b>Name</b></label><input type="text">
    //                    <label><b>Value</b></label><input type="text">
    //                    `
    // }

    htmlString += `<li><label><b>Choose tag: </b></label><select name="tags" id="add_food_tag_1">`

    tagsAvailable.forEach(tag => htmlString += `<option value="${tag}">${tag}</option>`)

    htmlString += `</select><input type="button" value="Add" onclick="addTags()"><input type="button" value="Delete" onclick="deleteTags()"></li></ul>`

    htmlString += `<ul><li><label><b>Is liquid: </b></label><input type="checkbox" id="is_liquid"></li></ul>`

    document.getElementById("add_content").innerHTML = htmlString
}

function AddSave() {
    let name = document.getElementById("add_food_name")
    let nutrition_type = document.getElementById("is_liquid")
    let tags = []
    let dict_nutrition = {}
    let i = 1
    let nutrition_name = ""
    let nutrition_value = ""
    let tag = ""
    let food = {}

    while (true) {
        nutrition_name = document.getElementById(`add_nutrition_name_${i}`)

        if (nutrition_name === null) {
            break
        }
        nutrition_value = document.getElementById(`add_nutrition_value_${i}`)
        dict_nutrition[nutrition_name.value] = nutrition_value.value
        nutrition_name.value = null
        nutrition_value.value = null
        i++
    }
    i = 1
    while (i <= 10) {

        tag = document.getElementById(`add_food_tag_${i}`)
        console.log(tag)
        if (tag === null) {
            console.log("Break")
            break
        }
        tags.push(tag.value)
        tag.value = null
        i++
    }

    food["id"] = `${foods.length + 1}`
    food["name"] = name.value

    if (nutrition_type.checked === false) {
        food["nutrition-per-100g"] = dict_nutrition
    } else {
        food["nutrition-per-100ml"] = dict_nutrition
    }
    if (tags.length !== 0) {
        food["tags"] = tags
    }
    console.log(food)
    console.log(foods)

    foods.push(food)
    name.value = null
    nutrition_type.checked = false
    displayTable()


}
