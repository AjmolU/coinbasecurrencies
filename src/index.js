const coinBaseApiSite = "https://api.coinbase.com/v2/currencies";

// defining table structure within JS to append to DOM dynamically.
function table() {
  let table = document.createElement('table');
  table.setAttribute('class',"pure-table");
  let thead = document.createElement('thead');
  thead.setAttribute('class', 'table-footer');
  let tr = document.createElement('tr');
  tr.setAttribute('class', 'pure-table-even');
  let td = document.createElement('td');
  td.colSpan = 4;
  let btn = document.createElement('button');
  btn.setAttribute('class', 'add-button');
  let a = document.createElement('a');
  a.href = '#openModal';
  a.setAttribute('class', 'add-button');
  let img = document.createElement('img');
  img.setAttribute('class', 'add-icon');
  img.src = './assets/add.svg';
  img.alt = 'update'
  let theadTwo = document.createElement('thead');

  table.appendChild(thead);
  thead.appendChild(tr);
  tr.appendChild(td);
  td.appendChild(btn);
  btn.appendChild(a);
  a.appendChild(img);

  let trTwo = document.createElement('tr');
  let tdId = document.createElement('td');
  tdId.innerHTML = 'ID';
  tdId.style.fontWeight = 'bold'
  let tdName = document.createElement('td');
  tdName.innerHTML = 'NAME';
  tdName.style.fontWeight = 'bold'
  let tdmin_size = document.createElement('td');
  tdmin_size.innerHTML = 'MIN SIZE';
  tdmin_size.style.fontWeight = 'bold'
  let tdAction = document.createElement('td');
  tdAction.innerHTML = 'ACTION';
  tdAction.style.fontWeight = 'bold'
  
  table.appendChild(theadTwo);
  theadTwo.appendChild(trTwo);
  trTwo.appendChild(tdId);
  trTwo.appendChild(tdName);
  trTwo.appendChild(tdmin_size);
  trTwo.appendChild(tdAction);

  let tBody = document.createElement('tbody');
  tBody.setAttribute('class', 'table-entries');
  tBody.appendChild(trTwo);
  table.appendChild(tBody);

  return table.outerHTML;
}

window.addEventListener('DOMContentLoaded', (event) => {
  loadrecords();
  //binding onsubmit event listener to addform
  document.getElementById("addForm").addEventListener('submit', function (e) {
    e.preventDefault(); //preventing default submit action
    //passing object to add_record function
    add_record({
      id: e.target[0].value.replace(/\s/g, ''), //removing space from id (id can't have space)
      name: e.target[1].value,
      min_size: e.target[2].value
    })
    //closing modal(popup form) after adding new record
    document.getElementById("close").click();
  });

  //binding onsubmit event listener to updateform
  document.getElementById("updateForm").addEventListener('submit', function (e) {
    e.preventDefault(); //preventing default submit action
    update_record({
      id: e.target[0].value.replace(/\s/g, ''), //removing space from id (id can't have space)
      name: e.target[1].value,
      min_size: e.target[2].value
    })
    //closing modal(popup form) after updating record
    document.getElementById("close").click();
  });
  //binding onclick event listener to onpage reload-button
  document.getElementById("reload-button").addEventListener('click', function () {
    window.location.reload();
  });
});

function loadrecords() { //READ
  fetch(coinBaseApiSite)
    .then(response => response.json())
    .then(function (data) {
      const currenciesArr = data.data;
      let app = document.getElementById("app");
      //we render table dynamically after our data from api is loaded and append to app.
      app.innerHTML = table(); //appending table to app
      let tbody = document.getElementsByClassName('table-entries')[0]; //getting table body 
      //looping over each record and adding to table
      for (let i = 0; i < currenciesArr.length; i++) {
        let id = currenciesArr[i].id;
        let name = currenciesArr[i].name;
        let minValue = currenciesArr[i].min_size;
        className = i % 2 === 0 ? "pure-table-odd" : "pure-table-even";
        //content is single record from api 
        content =
          `<tr class=${className} id="record-${id}">
            <td id="id"> ${id} </td>
            <td id="name"> ${name} </td>
            <td id="minVal"> ${minValue}</td>
            <td>
            <button onclick="delete_record('${id}')" id="delete-button-${id}" class="del-button"><img class="icon" src="./assets/trash.svg" alt="update"></button>
            <button class="update-button">
              <a href="#updateModal" onclick="editrecord('${id}','${name}','${minValue}')">
              <img class="icon" src="./assets/edit.svg" alt="edit">
              </a>
            </button>
            <button onclick="heart('${id}')" class="heart-button" id="heart-${id}">
            <svg class="icon" id="empty" clip-rule="evenodd"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/></svg>                   
            </button>
            </td>
            </tr>`;
        tbody.innerHTML += content; //appending content
      }
    });
}

function add_record(data) { //CREATE
  let tdContent = `<td>
                <button onclick="delete_record('${data.id}')" id="delete-button-${data.id}" class="del-button"><img class="icon" src="./assets/trash.svg" alt="update"></button>
                <button class="update-button">
                  <a href="#updateModal" onclick="editrecord('${data.id}','${data.name}','${data.min_size}')">
                  <img class="icon" src="./assets/edit.svg" alt="edit">
                  </a>
                </button>
                <button onclick="heart('${data.id}')" class="heart-button" id="heart-${data.id}">
                <svg class="icon" id="empty" clip-rule="evenodd"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/></svg>                   </button>
                </td>`
  let getTable = document.querySelector('.table-entries');
  let tr = document.createElement('tr');
  let tdId = document.createElement('td');
  let tdName = document.createElement('td');
  let tdSize = document.createElement('td');
  let className = "pure-table-even";
  if (getTable.lastElementChild.className === "pure-table-even") {
    className = "pure-table-odd"
  } 
  tr.setAttribute('class', className)
  tr.setAttribute('id', `record-${data.id}`)
  tdId.setAttribute('id', 'id');
  tdId.innerText = data.id;
  tdName.setAttribute('id', 'name');
  tdName.innerText = data.name;
  tdSize.setAttribute('id', 'minVal');
  tdSize.innerText = data.min_size;
  tr.appendChild(tdId);
  tr.appendChild(tdName);
  tr.appendChild(tdSize);
  tr.innerHTML += tdContent;
  getTable.appendChild(tr);
}

// First way was done using DB but changed it to use DOM manipulation
function update_record(data) { //UPDATE
  let row = document.getElementById("record-" + data.id);
  let name = row.querySelector('#name');
  let minVal = row.querySelector('#minVal');
  name.innerText = data.name;
  minVal.innerText = data.min_size
}

//this function deletes specific record from api
function delete_record(id) { //DELETE
  document.getElementById("delete-button-" + id).innerHTML = `<div class="delete-loader"></div>`; //replacing delete icon with loader 
  row = document.getElementById("record-" + id);
  row.parentNode.removeChild(row);
}

//this function fetches a record and add it to update form for edit purpose
function editrecord(a, b, c) {
  document.getElementById("update-id").value = a;
  document.getElementById("update-name").value = b;
  document.getElementById("update-value").value = c;
}

//this function is used to handle like/unlike button click
//this function checks like status of record and if it is liked then it unlikes it and vice versa
//It replaces the svg to perform above operations
function heart(id) {
  type = document.getElementById(`heart-${id}`).firstElementChild.getAttribute("id");
  if (type == "filled")
    document.getElementById(`heart-${id}`).innerHTML = `<svg class="icon" id="empty" clip-rule="evenodd"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/></svg>`
  if (type == "empty")
    document.getElementById(`heart-${id}`).innerHTML = `<svg class="icon" fill="#DC143C" id="filled" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></svg>`
}
