let form = document.getElementById('form');

form.addEventListener('click', storeData);

async function storeData (e) {
    try {
    e.preventDefault();
    console.log('hi');
    let name = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let loginDetails = {
        name,
        email,
        password
    }
    console.log(loginDetails);

    const response = await axios.post('http://localhost:4000/user/login-user', loginDetails)
    if(response.status === 201) {
        window.location.href = "login.html"
    } else {
        throw new Error('Failed to login')
    }
    }catch(err) {
        document.body.innerHTML += `<div style = "color:green;">${err} </div>`
    }
    
}