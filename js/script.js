let foods = []
let roll = 4 // how many products in the roll
let adaptive_font_size = 1.3
let adaptive_padding = 2.5
const window_width = window.screen.availWidth
let searchValue = ""
let tagCheckBoxes
let contains
let filter_displayed = false;
let sort_displayed = false;
let menu_displayed = false;
let last_menu_id_displayed
let unique_nutrition_values
let nutrition_values = []
let order = 1;
let executableID
let modalActvie = false;
let tagsCounter = 1
let nutritionCounter = 1
let newTagID = 0
let tagListManager = []
let newNutritionID = 0
let nutritionListManager = []

window.onload = () => {
    let url = "../data/foods.json";

    fetch(url)
        .then(response => response.json())
        .then(jsonData => {

            foods = jsonData
            let all_tags = []
            let all_contains = []
            foods.forEach(food => food[`tags`] !== undefined ? food[`tags`].forEach(tag => all_tags.push(tag)) : null)
            tagCheckBoxes = [...new Set(all_tags)].sort()
            foods.forEach(food => food["contains"] !== undefined ? food["contains"].forEach(contain => all_contains.push(contain)) : null)
            contains = [...new Set(all_contains)].sort()

            foods.forEach(element => {
                let nutrition_key_g = element["nutrition-per-100g"]
                if (nutrition_key_g) {
                    Object.keys(nutrition_key_g).forEach(key => {
                        nutrition_values.push(key)
                    })
                }
            })
            unique_nutrition_values = [...new Set(nutrition_values)].sort()

            main()
        })
}

function main() {


    let filter_content = ``
    tagCheckBoxes.forEach(checkbox => {

        filter_content += `<li><input type="checkbox" class="filter_option" id="${checkbox}" oninput="displayTable()">${checkbox}</li>`

    })
    filter_content += `<li><a href="#modal"><input type="button" class="manager_buttons" value="Tag Manager" onclick="displayTagManager()"></a></li>`
    document.getElementById("filter_list").innerHTML = filter_content

    let sort_content = `<li><div class="sort_option" id="name" onclick="sortNutrition('name')">Name</div></li>`
    unique_nutrition_values.forEach(checkbox => {
        sort_content += `<li><div class="sort_option" id="${checkbox}" onclick="sortNutrition('${checkbox}')">${checkbox}</div></li>`
    })
    sort_content += `<li><a href="#modal"><input type="button" class="manager_buttons" value="Nutrition Manager" onclick="displayNutritionManager()"></a></li>`
    document.getElementById("sort_list").innerHTML = sort_content
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
                                    <div class="element_button" id="view" onclick="viewModal(foodInfo('${food.id}'))"><a href="#modal"><img src="../icons/info.png" class="element_button_icon" alt="view"></a></div>
                                    <div class="element_button" id="edit" onclick="editModal(foodInfo('${food.id}'))"><a href="#modal"><img src="../icons/pencil.png" class="element_button_icon" alt="edit"></a></div>
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
    if (value === "name") {
        foods.sort((a, b) => a["name"] < b["name"] ? -order : order)
    } else {
        foods.sort((a, b) => {
            const aValue = (a["nutrition-per-100g"] && a["nutrition-per-100g"][value]) || 0;
            const bValue = (b["nutrition-per-100g"] && b["nutrition-per-100g"][value]) || 0;

            return order * (aValue - bValue);
        });
    }
    order *= -1;
    displaySort()
    let arrow = order !== 1 ? "↑" : "↓"
    document.getElementById("sort_button").value = value.toUpperCase() + arrow
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

    if (!modalActvie) {
        modalActvie = true
        document.getElementById("modal").style.display = 'flex'
        document.getElementById("view_content").style.display = 'flex'

        let objKeys = Object.keys(food).slice(1)
        let nutrKeys = food["nutrition-per-100g"] !== undefined ? Object.keys(food["nutrition-per-100g"]) : Object.keys(food["nutrition-per-100ml"])
        let content = ``

        objKeys.forEach(key => {
            if (key === "nutrition-per-100g") {
                content += `<li><div class="modal_label"><label><b>Nutrition: </b></label></div></li><ul class="modal_content inner_ul">`
                nutrKeys.forEach(key => {
                    content += `<li><div class="modal_label"><label><b>${key}</b></label></div><div class="modal_input"><input type="text" value="${food["nutrition-per-100g"][key]}" readonly="readonly"></div></li>`
                })
                content += `</ul>`
            } else if (key === "nutrition-per-100ml") {
                content += `<li><div class="modal_label"><label><b>Nutrition: </b></label></div></li><ul class="modal_content inner_ul">`
                nutrKeys.forEach(key => {
                    content += `<li><div class="modal_label"><label><b>${key}</b></label></div><div class="modal_input"><input type="text" value="${food["nutrition-per-100ml"][key]}" readonly="readonly"></div></li>`
                })
                content += `</ul>`
            } else {
                content += `<li><div class="modal_label"><label><b>${key}</b></label></div><div class="modal_input"><input type="text" value="${food[key]}" readonly="readonly"></div></li>`
            }

        })

        document.getElementById("view_content").innerHTML = content
    }

}

function editModal(food) {
    if (!modalActvie) {
        document.getElementById("modal").style.display = "flex"
        document.getElementById("edit_content").style.display = "block"
        document.getElementById("save_edit").style.display = "flex"
        modalActvie = true

        let objKeys = Object.keys(food).slice(1)
        let nutrKeys = food["nutrition-per-100g"] !== undefined ? Object.keys(food["nutrition-per-100g"]) : Object.keys(food["nutrition-per-100ml"])
        let content = ``

        objKeys.forEach(key => {
                if (key === "nutrition-per-100g" || key === "nutrition-per-100ml") {
                    content += `<ul class="modal_content inner_ul">`
                    nutrKeys.forEach(key => {
                        content += `<li><div class="modal_label"><label><b>${key}</b></label></div><div class="modal_input"><input type="text" id="${food.id}_${key}_edit" value="${food["nutrition-per-100g"] !== undefined ? food["nutrition-per-100g"][key] : food["nutrition-per-100ml"][key]}"></div></li>`
                    })
                    content += `<li><input type="button" value="+" class="modal_inner_buttons" id="add_nutrition_edit" onclick=""></li></ul>`
                } else if (key === "tags") { //
                    let tags = food[key]
                    let tagsAvailable = ["None"]
                    tagCheckBoxes.forEach(tag => tagsAvailable.push(tag))

                    content += `<li><div class="modal_label"><label><b>Tags: </b></label></div></li><ul class="modal_content inner_ul">`

                    for (let tag of tags) {
                        content += `<li><div class="modal_input"><select id="${food.id}_tag_${tag}">`
                        for (let tag_list of tagsAvailable) {
                            if (tag === tag_list) {
                                content += `<option value="${tag_list}" selected="selected">${tag_list}</option>`
                            } else {
                                content += `<option value="${tag_list}">${tag_list}</option>`
                            }
                        }
                        // tagsAvailable.forEach(tag_list => htmlString += `<option value="${tag_list}" ${tag === tag_list ? "selected=\"selected\"" : ""}>${tag_list}</option>`)
                        content += `</select></div></li>`
                    }
                    content += `<li><input type="button" value="+" class="modal_inner_buttons" id="add_nutrition_edit" onclick=""></li></ul>`

                } else if (key === "contains") {
                    content += `<li><div class="modal_label"><label><b>Contains: </b></label></div></li><ul class="modal_content inner_ul">`

                    for (let contain of food[key]) {
                        content += `<li><div class="modal_input"><select id="${food.id}_tag_${contain}">`
                        for (let contain_list of contains) {
                            if (contain === contain_list) {
                                content += `<option value="${contain_list}" selected="selected">${contain_list}</option>`
                            } else {
                                content += `<option value="${contain_list}">${contain_list}</option>`
                            }
                        }
                        content += `</select></div></li>`
                    }
                    content += `<li><input type="button" value="+" class="modal_inner_buttons" id="add_nutrition_edit" onclick=""></li></ul>`

                } else {
                    content += `<li><div class="modal_label"><label><b>${key}</b></label></div><div class="modal_input"><input type="text" id="${food.id}_${key}_edit" value="${food[key]}"></div></li>
                                <li><div class="modal_label"><label><b>Nutrition: </b></label></div></li>`
                }
            }
        )

        document.getElementById("edit_content").innerHTML = content
    }
}

function saveEdit() {

    foods.forEach(food => {
        if (food.id === executableID) {
            let objKeys = Object.keys(food).slice(1)
            let nutrKeys = Object.keys(food["nutrition-per-100g"])
            objKeys.forEach(key => {
                if (key === "name") {
                    food[key] = document.getElementById(food.id + "_" + key + "_edit").value
                    document.getElementById(food.id + "_" + key + "_edit").value = null
                } else if (key === "nutrition-per-100g") {
                    nutrKeys.forEach(key => {
                        food["nutrition-per-100g"][key] = document.getElementById(food.id + "_" + key + "_edit").value
                        document.getElementById(food.id + "_" + key + "_edit").value = null
                    })
                } else if (key === "tags") {
                    let i = 0
                    food.tags.forEach(tag => {
                        food["tags"][i] = document.getElementById(food.id + "_tag_" + tag).value
                        i++
                        document.getElementById(food.id + "_tag_" + tag).value = null
                    })
                } else if (key === "contains") {
                    let i = 0
                    food["contains"].forEach(contain => {
                        food["contains"][i] = document.getElementById(food.id + "_tag_" + contain).value
                        i++
                        document.getElementById(food.id + "_tag_" + contain).value = null
                    })
                } else {
                    nutrKeys.forEach(key => {
                        food["nutrition-per-100ml"][key] = document.getElementById(food.id + "_" + key + "_edit").value
                        document.getElementById(food.id + "_" + key + "_edit").value = null
                    })
                }

            })
        }
        document.getElementById("modal").style.display = "none"
        document.getElementById("save_edit").style.display = "none"
        document.getElementById("edit_content").style.display = "none"

        modalActvie = false;
    })
    displayTable()

}

function addNutrition() { // change list.children.length
    let listItem = document.createElement("li");  //https://www.w3schools.com/jsref/dom_obj_li.asp or https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_li_create
    let list = document.getElementById("nutrition_ul")
    nutritionCounter++
    let number = nutritionCounter
    listItem.innerHTML = `<div class="modal_label"><label><b>Name</b></label></div><div class="modal_input"><input type="text" value="" id="add_nutrition_name_${number}"></div>
                          <div class="modal_label"><label><b>Value</b></label></div><div class="modal_input"><input type="text" value="" id="add_nutrition_value_${number}"></div>
                          <div class="modal_inner_buttons_container"><input type="button" value="+" class="modal_inner_buttons" onclick="addNutrition()">
                          <input type="button" value="-" class="modal_inner_buttons" onclick="deleteNutrition(${number})"></div>
    `// https://www.w3schools.com/jsref/prop_element_childelementcount.asp
    listItem.id = `li_add_nutrition_name_${number}`
    list.appendChild(listItem);
}

function deleteNutrition(number) { // https://www.w3schools.com/jsref/met_node_removechild.asp
    let nutritionList = document.getElementById("nutrition_ul")
    let nutrition_for_delete = document.getElementById(`li_add_nutrition_name_${number}`)

    nutritionList.removeChild(nutrition_for_delete);
}

function addTags() {
    let itemLIst = document.createElement("li")
    let list = document.getElementById("tags_ul")
    let tagsAvailable = ["None"]
    tagCheckBoxes.forEach(tag => tagsAvailable.push(tag))
    tagsCounter++
    let number = tagsCounter

    let htmlString = `<div class="modal_label"><label><b>Choose tag: </b></label></div><select name="tags" id="add_food_tag_${number}">`

    tagsAvailable.forEach(tag => htmlString += `<option value="${tag}">${tag}</option>`)

    htmlString += `</select><div class="modal_inner_buttons_container"><input type="button" value="+" class="modal_inner_buttons" onclick="addTags()">
                                                                        <input type="button" value="-" class="modal_inner_buttons" onclick="deleteTags(${number})"></div>`
    itemLIst.innerHTML = htmlString
    itemLIst.id = `li_add_food_tag_${number}`
    list.appendChild(itemLIst)
}

function deleteTags(number) {
    let tags = document.getElementById("tags_ul")
    let tag_for_delete = document.getElementById(`li_add_food_tag_${number}`)
    tags.removeChild(tag_for_delete)
}


function displayAdd() {
    if (modalActvie) {
        return
    }
    modalActvie = true
    document.getElementById("modal").style.display = "flex"
    document.getElementById("add_content").style.display = "block"
    document.getElementById("save_add").style.display = "flex"
    modalActvie = true;
    tagsCounter = 1
    nutritionCounter = 1

    let tagsAvailable = ["None"]
    tagCheckBoxes.forEach(tag => tagsAvailable.push(tag))
    let htmlString = ``

    htmlString += `<li><div class="modal_label"><label><b>Name</b></label></div><div class="modal_input"><input type="text" id="add_food_name"></div></li>`
    htmlString += `<li><div class="modal_label"><label><b>Nutrition :</b></label></div></li><ul id="nutrition_ul" class="modal_content inner_ul">`


    htmlString += `<li><div class="modal_label"><label><b>Name</b></label></div><div class="modal_input"><input type="text" value="" id="add_nutrition_name_${nutritionCounter}"></div>
                   <div class="modal_label"><label><b>Value</b></label></div><div class="modal_input"><input type="text" value="" id="add_nutrition_value_${nutritionCounter}"></div>
                   <div class="modal_inner_buttons_container"><input type="button" value="+" class="modal_inner_buttons" onclick="addNutrition()">
                   </div></li>
                       `
    htmlString += `</ul>`
    htmlString += `<li><div class="modal_label"><label><b>Tags :</b></label></div></li>`

    htmlString += `<ul id="tags_ul" class="modal_content inner_ul">`

    // for (let i = 0; i < num_tags; i++) {
    //     htmlString += `<li><label><b>Name</b></label><input type="text">
    //                    <label><b>Value</b></label><input type="text">
    //                    `
    // }

    htmlString += `<li><div class="modal_label"><label><b>Choose tag: </b></label></div><select name="tags" id="add_food_tag_${tagsCounter}">`

    tagsAvailable.forEach(tag => htmlString += `<option value="${tag}">${tag}</option>`)

    htmlString += `</select><div class="modal_inner_buttons_container"><input type="button" value="+" class="modal_inner_buttons" onclick="addTags()">
                   </div></li></ul>`

    htmlString += `<ul class="modal_content"><li><div class="modal_label"><label><b>Is liquid: </b></label></div><input type="checkbox" id="is_liquid"></li></ul>`

    document.getElementById("add_content").innerHTML = htmlString
}

function AddSave() {
    modalActvie = false
    document.getElementById("modal").style.display = "none"
    document.getElementById("add_content").style.display = "none"
    let name = document.getElementById("add_food_name")
    let nutrition_type = document.getElementById("is_liquid")
    let tags = []
    let dict_nutrition = {}
    let i = 1
    let nutrition_name = ""
    let nutrition_value = ""
    let tag = ""
    let food = {}

    while (nutritionCounter > 0) {
        nutrition_name = document.getElementById(`add_nutrition_name_${i}`)
        if (nutrition_name !== null) {
            nutrition_value = document.getElementById(`add_nutrition_value_${i}`)
            dict_nutrition[nutrition_name.value] = nutrition_value.value
            nutrition_name.value = null
            nutrition_value.value = null
        }
        i++
        nutritionCounter--
    }
    i = 1
    while (tagsCounter !== 0) {

        tag = document.getElementById(`add_food_tag_${i}`)
        if (tag !== null && tag.value !== "None") {
            tags.push(tag.value)
            tag.value = null
        }
        i++
        tagsCounter--

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

    foods.push(food)
    name.value = null
    nutrition_type.checked = false
    displayTable()

}


function displayTagManager(tagListManager_local, newTagID_local) {
    if (modalActvie)
        return
    modalActvie = true

    if (tagListManager_local === undefined) {
        tagListManager = [...tagCheckBoxes]
    } else {
        tagListManager = tagListManager_local
    }

    if (newTagID_local === undefined) {
        newTagID = 0
    } else {
        newTagID = newTagID_local
    }

    let htmlString = ``
    let i = 1

    tagListManager.forEach(tag => {
        htmlString += `<li><div class="modal_label"><label>Tag ${i}: </label></div><div class="modal_input"><input type="text" value="${tag}" id="${tag}_edit"></div>
        <input type="button" value="-" class="modal_inner_buttons" onclick="deleteTag('${tag}_edit')"></li>`

        i += 1
    })

    htmlString += `<li><input type="button" value="+" class="modal_inner_buttons" id="add_tags" onclick="addNewTags()"></li>`

    document.getElementById("tag_manager").innerHTML = htmlString

    document.getElementById("modal").style.display = "flex"
    document.getElementById("tag_manager").style.display = "flex"
    document.getElementById("save_tags").style.display = "flex"
    document.getElementById("add_tags").style.display = "flex"
}

function saveTags() {
    let i = 0
    tagListManager.forEach(tag => {
        tagCheckBoxes[i] = document.getElementById(`${tag}_edit`).value
        i += 1
    })

    for (let i = 0; i <= newTagID; i++) {
        let tag = document.getElementById(`new_tag${i}`)
        console.log(tag)
        if (tag !== null) {
            tagListManager.push(tag.value.toLowerCase())
        }
    }


    tagCheckBoxes = tagListManager
    main()
    document.getElementById("modal").style.display = "none"
    document.getElementById("tag_manager").style.display = "none"
    document.getElementById("save_tags").style.display = "none"
    document.getElementById("add_tags").style.display = "none"
    modalActvie = false
}


function deleteTag(element) {
    let selectedTag = tagListManager.indexOf(document.getElementById(element).value)
    tagListManager.splice(selectedTag, 1)
    modalActvie = false
    displayTagManager(tagListManager, newTagID)
    main()
}

function addNewTags() {
    let htmlString = ``

    htmlString += `<li><div class="modal_label"><label>New Tag: </label></div><div class="modal_input"><input type="text" value="" id="new_tag${newTagID}"></div></li>`
    newTagID += 1

    document.getElementById("tag_manager").innerHTML += htmlString
}

function displayNutritionManager(nutritionListManager_local, newNutritionID_local) {
    if (modalActvie)
        return
    modalActvie = true

    if (nutritionListManager_local === undefined) {
        nutritionListManager = [...unique_nutrition_values]
    } else {
        nutritionListManager = nutritionListManager_local
    }

    if (newNutritionID_local === undefined) {
        newNutritionID = 0
    } else {
        newNutritionID = newNutritionID_local
    }

    let htmlString = ``
    let i = 1

    nutritionListManager.forEach(nutrition => {
        htmlString += `<li><div class="modal_label"><label>Nutrition ${i}: </label></div><div class="modal_input"><input type="text" value="${nutrition}" id="${nutrition}_edit"></div>
        <input type="button" value="-" class="modal_inner_buttons" onclick="deleteNutritionManager('${nutrition}_edit')"></li>`
        i += 1
    })

    htmlString += `<li><input type="button" value="+" class="modal_inner_buttons" id="add_tags" onclick="addNewNutrition()"></li>`

    document.getElementById("nutrition_manager").innerHTML = htmlString

    document.getElementById("modal").style.display = "flex"
    document.getElementById("nutrition_manager").style.display = "flex"
    document.getElementById("save_nutrition").style.display = "flex"
    document.getElementById("add_nutrition").style.display = "flex"
}

function addNewNutrition() {
    let htmlString = ``

    htmlString += `<li><div class="modal_label"><label>New Nutrition: </label></div><div class="modal_input"><input type="text" value="" id="new_nutrition${newNutritionID}"></div></li>`
    newNutritionID += 1

    document.getElementById("nutrition_manager").innerHTML += htmlString
}

function deleteNutritionManager(element) {
    let selectedTag = nutritionListManager.indexOf(document.getElementById(element).value)
    nutritionListManager.splice(selectedTag, 1)
    modalActvie = false
    displayNutritionManager(nutritionListManager, newNutritionID)
    main()
}

function saveNutrition() {
    let i = 0
    nutritionListManager.forEach(nutrition => {
        tagCheckBoxes[i] = document.getElementById(`${nutrition}_edit`).value
        i += 1
    })

    for (let i = 0; i <= newNutritionID; i++) {
        let nutrition = document.getElementById(`new_nutrition${i}`)
        console.log(nutrition)
        if (nutrition !== null) {
            tagListManager.push(nutrition.value.toLowerCase())
        }
    }


    unique_nutrition_values = nutritionListManager
    main()
    modalActvie = false
    document.getElementById("modal").style.display = "none"
    document.getElementById("nutrition_manager").style.display = "none"
    document.getElementById("save_nutrition").style.display = "none"
    document.getElementById("add_nutrition").style.display = "none"
}

function closeModal() {
    if (modalActvie) {
        document.getElementById("modal").style.display = "none"
        document.getElementById("view_content").style.display = "none"
        document.getElementById("edit_content").style.display = "none"
        document.getElementById("add_content").style.display = "none"
        document.getElementById("save_edit").style.display = "none"
        document.getElementById("add_content").style.display = "none"
        document.getElementById("save_add").style.display = "none"
        document.getElementById("tag_manager").style.display = "none"
        document.getElementById("save_tags").style.display = "none"
        document.getElementById("nutrition_manager").style.display = "none"
        document.getElementById("save_nutrition").style.display = "none"
    }
    modalActvie = false
}
