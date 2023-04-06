let form = document.getElementById('form');

form.addEventListener('click', storeData);

function storeData (e) {
    e.preventDefault();
    console.log('hi');
    let name = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let data = {
        name,
        email,
        password
    }

    localStorage.setItem('data',JSON.stringify(data));
    // axios.post('http://localhost:4000/expense/add-expense', data)
    // .then((response) => {
    //     showUserDetails(response.data.data);
    //     console.log(response)
    // })
    // .catch((err) => {
    //     document.body.innerHTML = document.body.innerHTML+`<h4>Something went Wrong</h4>`;
    //     console.log(err);
    // })
}