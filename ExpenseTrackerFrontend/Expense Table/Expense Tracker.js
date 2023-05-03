
const myform = document.getElementById('myform');
let items = document.getElementById('items');
const backendApi = 'http://localhost:3000/expense';
const pagination = document.getElementById('pagination');

const razorPay = document.getElementById('rzp-button');


myform.addEventListener('submit', storeExpenses);

async function storeExpenses(e) {
    try {
        e.preventDefault();

    let amount = document.getElementById('amount').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;

    let expenseDetails = {
        amount,
        description,
        category
    }

    // showExpenseOnScreen(expenseDetails);
    const token = localStorage.getItem('token');
    const response = await axios.post(`${backendApi}/add-expense`, expenseDetails, { headers: {"Authorization": token} })
        showExpenseOnScreen(response.data.newExpenseDetail);
    } catch(err) {
        console.log(err);
        document.body.innerHTML = document.body.innerHTML+`<h4 style="text-align: center;">Something went Wrong</h4>`;
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', () => {
    const page = 1;
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token); 
    console.log(decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser) {
        showPremiumText(razorPay);
        showLeaderBoardOnScreen()
    }
    axios.get(`${backendApi}/get-expenses?page=${page}`, { headers: {"Authorization": token} }).then((response) => {
        listExpenses(response.data.allExpensesDetails)
        showPagination(response.data)
    }).catch((error) => console.log(error));
})

function listExpenses(userExpenses) {
    for(let i=0; i<userExpenses.length; i++) {
        showExpenseOnScreen(userExpenses[i]);
    }
}

function showExpenseOnScreen(expenseDetails) {

    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    var th0 = document.createElement('td');
    // var th = document.createElement('td')
    var th1 = document.createElement('td')
    var th2 = document.createElement('td')
    var th3 = document.createElement('td')
    // var th4 = document.createElement('td')
    tbody.appendChild(tr)
    // tr.appendChild(th)
    tr.appendChild(th0)
    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    // tr.appendChild(th4)
    th0.textContent = expenseDetails.amount
    // th.textContent = expenseDetails.createdAt;
    th1.textContent = expenseDetails.description;
    th2.textContent = expenseDetails.category;
    

    function deleteId(itemId) {
        const token = localStorage.getItem('token');
        axios.delete(`${backendApi}/delete-expense/${itemId}`, { headers: {"Authorization": token} })
        .then((res) => console.log(res))
        .catch(err => console.log(err))
    }

    var deletebtn = document.createElement('button');
    deletebtn.className = 'btn btn-danger btn-sm';
    deletebtn.innerHTML = 'Delete';
    deletebtn.onclick = () => {
            items.removeChild(tbody)
            deleteId(expenseDetails.id)
    }

    function editId(itemId) {
        const token = localStorage.getItem('token');
        axios.put(`${backendApi}/delete-expense/${itemId}`, { headers: {"Authorization": token} })
        .then((res) => console.log(res))
    }
    
    let editbtn = document.createElement('button')
    editbtn.className = 'btn btn-success btn-sm';
    editbtn.innerHTML = 'Edit'
    editbtn.onclick = () => {
      items.removeChild(tbody)
      editId(expenseDetails.id)
      deleteId(expenseDetails.id)
      document.getElementById('amount').value = expenseDetails.amount
      document.getElementById('description').value = expenseDetails.description
      document.getElementById('category').value = expenseDetails.category
    }

    th3.appendChild(editbtn)

    th3.appendChild(deletebtn)
    
    items.appendChild(tbody)
}

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}) {
    pagination.innerHTML = '';

    if(hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage
        btn2.addEventListener('click', () => getProducts(previousPage))
        pagination.appendChild(btn2)
    }
    const btn1 = document.createElement('button')
    btn1.innerHTML = `<h3>${currentPage}</h3>`
    btn1.addEventListener('click', () => getProducts(currentPage))
    pagination.appendChild(btn1)
    if(hasNextPage) {
        const btn3 = document.createElement('button')
        btn3.innerHTML = nextPage
        btn3.addEventListener('click', () => getProducts(nextPage))
        pagination.appendChild(btn3)
    };
}

function getProducts(page) {
    const token = localStorage.getItem('token');
    axios.get(`${backendApi}/get-expenses?page=${page}`, { headers: {"Authorization": token} }).then((response) => {
        listExpenses(response.data.allExpensesDetails)
        showPagination(response.data)
    }).catch((error) => console.log(error));
}

function showPremiumText(rzp){
    rzp.value = 'You are a Premium user'
    rzp.className = 'btn btn-warning';
    rzp.disabled = true;
    document.getElementById('downloadexpense').disabled = false;
    // document.getElementById('showFilesDownloaded').disabled = false;
}

function showLeaderBoardOnScreen() {
    const leaderBoard = document.createElement('input')
    leaderBoard.type = "button"
    leaderBoard.value = 'Show LeaderBoard'
    leaderBoard.className = 'btn btn-success'
    leaderBoard.onclick = async() => {
        const token = localStorage.getItem('token');
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/leaderboard',{ headers: {"Authorization": token} })
        console.log(userLeaderBoardArray);
        
        var leaderBoardElem = document.getElementById('leaderboard')
        leaderBoardElem.innerHTML += '<h3>Leader Board </h3>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderBoardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses}</li>`
        })
    }
    document.getElementById('message').appendChild(leaderBoard)
}

razorPay.onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiummembership',{ headers: {"Authorization": token} })
    console.log(response);
    var options = 
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: {"Authorization": token} })

            alert(`You are a Premium User Now`)
            showPremiumText(razorPay)//, tokens);
            localStorage.setItem('token', res.data.token)
            showLeaderBoardOnScreen()
        },
    };
    if(response.status === 200) {
        alert('Transaction successful')
    }
    const rzpl = new Razorpay(options);
    rzpl.open();
    e.preventDefault();

    rzpl.on('payment failed', function (response) {
        console.log(response);
        alert('Something went wrong')
    });
}

function download(){
    console.log('this is kiran');
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 200){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}

function showError(err){
    document.body.innerHTML += `<p style="color:red; text-align: center;">${err}</p>`
}

// function showFilesDownloaded() {
//     const token = localStorage.getItem('token');
//     const filesArray = axios.get('http://localhost:3000/user/filesList',{ headers: {"Authorization": token} })
//         console.log(filesArray);
//         showListOfFiles(filesArray.data.fileList);
// }

// function showListOfFiles(file) {
//     document.getElementById('fileList').hidden = false;
//     const li = document.createElement('li');
//     li.textContent = `File Name - ${file.fileName} - File Urls - ${file.fileURL}`
//     document.getElementById('fileItem').append(li);
// }