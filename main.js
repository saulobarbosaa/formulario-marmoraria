"use strict";

//barra de pesquisa
const filterRecords = document.querySelector(".recordss");
const inputSearchUsers = document.querySelector(".search-container input");

inputSearchUsers.addEventListener("input", (event) => {
  const inputValue = event.target.value.trim().toLowerCase();
  Array.from(filterRecords.children)
    .filter(
      (recordss) => !recordss.textContent.toLowerCase().includes(inputValue)
    )
    .forEach((recordss) => {
      recordss.classList.remove("d-flex");
      recordss.classList.add("hidden");
    });
  Array.from(filterRecords.children)
    .filter((recordss) =>
      recordss.textContent.toLowerCase().includes(inputValue)
    )
    .forEach((recordss) => {
      recordss.classList.remove("hidden");
      recordss.classList.add("d-flex");
    });
});

// *****
var searchinput = document.querySelector(".search-input");
let searchcontainer = document.querySelector(".search-container");

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("dbClient")) ?? [];
const setLocalStorage = (dbClient) =>
  localStorage.setItem("dbClient", JSON.stringify(dbClient));

// CRUD
const deleteClient = (index) => {
  const dbClient = readClient();
  dbClient.splice(index, 1);
  setLocalStorage(dbClient);
};

const updateClient = (index, client) => {
  const dbClient = readClient();
  dbClient[index] = client;
  setLocalStorage(dbClient);
};

const readClient = () => getLocalStorage();

const createClient = (client) => {
  const dbClient = getLocalStorage();
  dbClient.push(client);
  setLocalStorage(dbClient);
};

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

// Interação com o layout

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};
const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      telefone2: document.getElementById("telefone2").value,
      endereco: document.getElementById("endereco").value,
      obs: document.getElementById("obs").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index == "new") {
      createClient(client);
      updateTable();
      closeModal();
    } else {
      updateClient(index, client);
      updateTable();
      closeModal();
    }
  }
};

const createRow = (client, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.telefone}</td>
        <td>${client.telefone2}</td>
        <td>${client.endereco}</td>
        <td>${client.obs}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" onclick="window.location.reload()">Excluir</button>
        </td>
    `;
  document.querySelector("#tableClient>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableClient>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbClient = readClient();
  clearTable();
  dbClient.forEach(createRow);
};

const fillFields = (client) => {
  document.getElementById("nome").value = client.nome;
  document.getElementById("email").value = client.email;
  document.getElementById("telefone").value = client.telefone;
  document.getElementById("telefone2").value = client.telefone2;
  document.getElementById("endereco").value = client.endereco;
  document.getElementById("obs").value = client.obs;
  document.getElementById("nome").dataset.index = client.index;
};

const editClient = (index) => {
  const client = readClient()[index];
  client.index = index;
  fillFields(client);
  openModal();
};

const editDelete = (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");
    if (action == "edit") {
      editClient(index);
    } else {
      const client = readClient()[index];
      const response = confirm(
        `Deseja realmente excluir o cliente ${client.nome}`
      );
      if (response) {
        deleteClient(index);
        updateTable();
      }
    }
  }
};

updateTable();

// Eventos
document
  .getElementById("cadastrarCliente")
  .addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("salvar").addEventListener("click", saveClient);

document
  .querySelector("#tableClient>tbody")
  .addEventListener("click", editDelete);

document.addEventListener("keypress", function (eventSave) {
  if (eventSave.keyCode === 13) {
    if (isValidFields()) {
      const client = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        telefone2: document.getElementById("telefone2").value,
        endereco: document.getElementById("endereco").value,
        obs: document.getElementById("obs").value,
      };
      const index = document.getElementById("nome").dataset.index;
      if (index == "new") {
        createClient(client);
        updateTable();
        closeModal();
        window.location.reload();
      } else {
        updateClient(index, client);
        updateTable();
        closeModal();
      }
    }
  }
});

/*document.addEventListener("keypress", function(event) {
    if(event.keyCode === 13) {
        const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
    }
})*/
