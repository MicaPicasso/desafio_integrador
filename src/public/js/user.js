
function llamarApi() {
    console.log("Llamando api users!!!");
    fetch('/api/user/65aae0bfbd2c46d9e6b7b4a7', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    }).then(result => {
        if (result.status === 200) {
            result.json()
                .then(json => {
                    console.log(json);
                });
        } else if (result.status === 401) {
            console.log(result);
            alert("Login invalido revisa tus credenciales!");
        }
    })
};
llamarApi();