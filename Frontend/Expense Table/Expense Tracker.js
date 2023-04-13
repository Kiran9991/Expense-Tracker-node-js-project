
const myform = document.getElementById('myform');
let items = document.getElementById('items');


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

    axios.post('http://localhost:3000/expense/add-expense', expenseDetails)
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
    axios.get('http://localhost:3000/expense/get-expenses').then((response) => {
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
        axios.delete('http://localhost:3000/expense/delete-expense/'+itemId)
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
        axios.put('http://localhost:3000/expense/delete-expense/'+itemId)
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