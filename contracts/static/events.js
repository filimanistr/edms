
/* On Click Events Handlers */

var overlay = document.querySelector(".overlay");
var current_opened_win;

function showWindow(win) {
    overlay.style.display = "block";
    win.style.display = "block";

    window.setTimeout(function() {
        overlay.style.opacity = 1;
        win.style.opacity = 1;
        win.style.transform = 'scale(1)';
    },0);

    overlay.onclick = function() {
        closeWindow(current_opened_win);
    }
}

function closeWindow(win) {
    overlay.onclick = null;
    overlay.style.opacity = 0;
    win.style.opacity = 0;
    win.style.transform = 'scale(0)';
    window.setTimeout(function(){
        win.style.display = "none";
        overlay.style.display = "none";
    },700);
}

function showContractDetails(contract_id) {
    // Отображает и заполняет окно, что открывается при нажатии на контракт
    let win = document.querySelector(".about-contract");
    addInfoToAboutContractWindow(contract_id);
    current_opened_win = win;
    showWindow(win);
}

function showNewContractWindow() {
    // Отображает и заполняет окно создания нового контракта
    let win = document.querySelector(".add-contract");
    addInfoToNewContractWindow();
    current_opened_win = win;
    showWindow(win);
}


function createNewContract() {
    // Собираем все выбранные поля с файлом, создаем договор и отображаем
    let file = document.getElementById("new-contract-input").files[0];
    let counterpartie = document.getElementById("select0").value;
    let template = document.getElementById("select1").value;
    closeWindow(current_opened_win);

    let formData = new FormData();
    formData.append("counterparty", counterpartie);
    formData.append("template", template);
    formData.append("title", file.name);
    formData.append('file', file);

    createContract(formData).then(new_contract => {
        drawRow(new_contract).then(contract_wrapper => {
            addContract(new_contract.id, contract_wrapper)
        });
    });
}

function saveContract() {

    
}
