//blur sa triggerne ked pole strati focus

document.addEventListener('DOMContentLoaded', async () => {     //zbehne ked sa nacita cele HTML (bez stylov, obrazkov...)
    const response = await fetch('/data');      //request na /data endpoint
    const data = await response.json();         //data sa parsne do premennej data
    const dataDiv = document.getElementById('data');    // Get the HTML element with the ID 'data' to insert the fetched table data into it

    if (data.length > 0) {
        const table = document.createElement('table');  // creatne elementy table, thead, tbody aby sa do nich mohli vkladat data
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr'); // tr = table row = hlavicka tabulky
        Object.keys(data[0]).forEach(column => {
            const th = document.createElement('th'); // vytvori th = table header = riadky pre kazdy stlpec + naplni ich menami stlpcov
            th.textContent = column;
            headerRow.appendChild(th);
        });
        const th = document.createElement('th');    // samostatny actions button vytvarany javascriptom zakazdym
        th.textContent = 'Actions';
        headerRow.appendChild(th);
        thead.appendChild(headerRow);


        // Create table body
        data.forEach(row => {
            const tr = document.createElement('tr');    //generuje tabulku
            Object.entries(row).forEach(([key, value]) => {
                console.log("Key: " + key);
                console.log("Value: " + value);
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });

            const actionsCell = document.createElement('td');   // vytvaranie actions cell
            actionsCell.classList.add('actions-Cell'); // Add a class for styling
            const delete_button = document.createElement('button');
            delete_button.type = 'button';
            delete_button.classList.add('delete-button'); // Add a class for styling
            
            // Create an icon element for Font Awesome
            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-trash'); // Font Awesome trashcan icon class

            // Append the icon to the button
            delete_button.appendChild(icon);


            tr.appendChild(actionsCell);
            actionsCell.appendChild(delete_button);

            tbody.appendChild(tr);
        });
        table.appendChild(thead);
        table.appendChild(tbody);
        dataDiv.appendChild(table);
    } else {
        dataDiv.textContent = 'No data found';
    }
});

async function updateName(event) {
    const input = event.target;
    const id = input.dataset.id;
    const newName = input.value;

    try {
        const response = await fetch(`/update-name/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
        });
        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error updating name:', error);
    }
}  