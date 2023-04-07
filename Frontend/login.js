let submitbtn = document.getElementById('submit');

submitbtn.addEventListener('click', loginUser);

async function loginUser(e) {
    try {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginDetails = {
        email,
        password
    }

    await axios.get(`http://localhost:3000/user/get-users`)
    .then(response => {
        if(loginDetails.email === response.userDetail.email) {
            alert('Successfully login');
        }else {
            throw new Error('Failed to login');
        }
    })
    }catch(err) {
        document.body.innerHTML += `<div style = "color:red;">${err} </div>`
    }
}