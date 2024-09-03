function delete_row(table_name, id) {
    fetch(`/delete/${table_name}/${id}`, {
        method: "DELETE",
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('There was a problem with the delete request:', error);
        })
}