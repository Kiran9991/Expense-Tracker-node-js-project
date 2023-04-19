
const myform = document.getElementById('myform');
let items = document.getElementById('items');
// const Razorpay = require('razorpay');

const razorPay = document.getElementById('rzp-button');


myform.addEventListener('submit', storeExpenses);

function storeExpenses(e) {
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
    axios.post('http://localhost:3000/expense/add-expense', expenseDetails, { headers: {"Authorization": token} })
    .then((response) => {
        showExpenseOnScreen(response.data.newExpenseDetail);
        console.log(response)
    })
    .catch((err) => {
        document.body.innerHTML = document.body.innerHTML+`<h4>Something went Wrong</h4>`;
        console.log(err);
    })

}

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/expense/get-expenses', { headers: {"Authorization": token} }).then((response) => {
        for(let i=0; i<response.data.allExpensesDetails.length; i++) {
            showExpenseOnScreen(response.data.allExpensesDetails[i]);
        }
    }).catch((error) => console.log(error));
})

function showExpenseOnScreen(expenseDetails) {

    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    var th = document.createElement('td')
    var th1 = document.createElement('td')
    var th2 = document.createElement('td')
    var th3 = document.createElement('td')
    var th4 = document.createElement('td')
    tbody.appendChild(tr)
    tr.appendChild(th)
    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    tr.appendChild(th4)
    th.textContent = expenseDetails.amount;
    th1.textContent = expenseDetails.description;
    th2.textContent = expenseDetails.category;
    th4.innerHTML = ' '

    function deleteId(itemId) {
        const token = localStorage.getItem('token');
        axios.delete('http://localhost:3000/expense/delete-expense/'+itemId, { headers: {"Authorization": token} })
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
        axios.put('http://localhost:3000/expense/delete-expense/'+itemId, { headers: {"Authorization": token} })
        .then((res) => console.log(res))
    }
    
    let editbtn = document.createElement('button')
    editbtn.className = 'btn btn-success btn-sm';
    editbtn.innerHTML = 'Edit'
    editbtn.onclick = () => {
      items.removeChild(tbody)
      editId(expenseDetails.id)
      document.getElementById('amount').value = expenseDetails.amount
      document.getElementById('description').value = expenseDetails.description
      document.getElementById('category').value = expenseDetails.category
    }

    // th3.appendChild(editbtn)

    th3.appendChild(deletebtn)
    
    items.appendChild(tbody)
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
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: {"Authorization": token} })

            alert(`You are a Premium User Now`)
            razorPay.textContent = `You are a Premium user`
            razorPay.className = 'btn btn-warning';
            razorPay.disabled = true;
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