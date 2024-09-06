document.addEventListener("DOMContentLoaded", function () {
    generateTable();
});

//blur sa triggerne ked pole strati focus

async function generateTable() {
    const response = await fetch('/data');      //request na /data endpoint
    const data = await response.json();         //data sa parsne do premennej data
    const dataDiv = document.getElementById('data');    // Get the HTML element with the ID 'data' to insert the fetched table data into it
    dataDiv.innerHTML = '';

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

                if (key === 'module_type_ID') {
                    // Extract the first element of the data array inside the Buffer object
                    try {
                        const bufferValue = value.data[0];
                        td.textContent = bufferValue ? 'REL' : 'RGB';
                    }
                    catch {
                        console.log('Buffer is null')
                        td.textContent = value;
                    }
                }
                else {
                    td.textContent = value;
                }

                td.dataset.key = key;  // Set the data-key attribute
                tr.appendChild(td);
            });

            const actionsCell = document.createElement('td');   // vytvaranie actions cell
            actionsCell.classList.add('actions-Cell'); // Add a class for styling
            actionsCell.dataset.key = 'Actions';  // Set the data-key attribute

            const edit_button = document.createElement('button');    //edit button
            edit_button.type = 'button';
            edit_button.classList.add('edit-button');
            const editIcon = document.createElement('i');   // Create an icon element for Font Awesome
            editIcon.classList.add('fas', 'fa-edit');
            edit_button.appendChild(editIcon);

            const delete_button = document.createElement('button'); //delete button
            delete_button.type = 'button';
            delete_button.classList.add('delete-button'); // Add a class for styling
            const trashIcon = document.createElement('i');   // Create an icon element for Font Awesome
            trashIcon.classList.add('fas', 'fa-trash');
            delete_button.appendChild(trashIcon);

            delete_button.dataset.table = 'esp';
            delete_button.dataset.esp_id = row.esp_id;

            // Add event listener to call delete_row function
            delete_button.addEventListener('click', async (event) => {
                const tableName = event.target.closest('button').dataset.table;
                const id = event.target.closest('button').dataset.esp_id;
                await delete_row(tableName, id);
                //generateTable();  //refresh table

                event.target.closest('tr').remove();    //namiesto refreshnutia celej tabulky mozem vymazat najblizsi riadok
            });

            let edit_state = false;
            edit_button.addEventListener('click', (event) => {
                const row = event.target.closest('tr');

                edit_button.style.backgroundColor = (edit_state) ? 'rgb(242, 242, 242)' : 'rgb(128, 192, 128)';
                if (edit_state) edit_row(row);

                row.querySelectorAll('td').forEach(td => {
                    if (td.dataset.key !== 'esp_id' && td.dataset.key !== 'Actions') { // Make all cells editable except for IDs
                        td.contentEditable = (td.contentEditable === "true") ? "false" : "true";
                    }
                });
                edit_state = !edit_state;
            });

            tr.appendChild(actionsCell);
            actionsCell.appendChild(edit_button);
            actionsCell.appendChild(delete_button);

            tbody.appendChild(tr);
        });
        table.appendChild(thead);
        table.appendChild(tbody);
        dataDiv.appendChild(table);
    } else {
        dataDiv.textContent = 'No data found';
    }
};

