window.onload = () => {
    let url = "../data/foods.json";

    fetch(url)
    .then(response => response.json())
    .then(jsonData => {
        let htmlString = `<table>`;

        jsonData.forEach(food => {
            htmlString += `<tr>`;
            htmlString += `<td>${food.id}</td>`;
            htmlString += `<td>${food.name}</td>`;
            htmlString += `</tr>`;
        });

        htmlString += `</table>`;

        document.getElementById("main_data").innerHTML = htmlString; // Fix: Set innerHTML property
    });
};