async function delete_row(table_name, id) {
    try {
        const response = await fetch(`/delete/${table_name}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Server response:', data);
    } catch (error) {
        console.error('There was a problem with the delete request:', error);
    }
}