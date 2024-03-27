
var user;
var statuses_colors = {
    "red": "#FF3838",
    "yellow": "#FCE83A",
    "green": "#56F000"
} 

function makeRequest(method, url, token=null, params=null) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };

        if (token !== null) 
            xhr.setRequestHeader("X-CSRFToken", token);
        if (params !== null) {
	        xhr.send(params);
        } else {    
            xhr.send();
        }
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// const csrftoken = Cookie.get('csrftoken'); // Алтернатива функции внизу
const csrftoken = getCookie('csrftoken');

function getStatusColor(status) {
    if (status === "согласован") 
        return "#56F000";
    else if ((user.is_admin) & (status === "ожидает согласования заказчиком")) 
        return "#FCE83A";
    else if ((user.is_admin === false) & (status === "ожидает согласования поставщиком")) 
        return "#FCE83A";
    else 
        return "#FF3838";
}


// Все обращения к АПИ собранны здесь в 1 месте, и вместо
// того чтобы ходить по всем js файлам собирать все эти вызовы
// их можно редактировать тут (ИЛИ можно было бы определить тут
// константы URLS, и их подставлять в вызовы, вместо функций)

async function getUserInfo() {
    let url = "/api/is_admin/";
    let r = await makeRequest("GET", url);
    user = JSON.parse(r);
    return user;
}

async function getContractFields() {
    // FIXME: Пока что не применяется, могут быть проблемы
    let url = "/api/contracts/fields/";
    let r = await makeRequest("GET", url);
    return JSON.parse(r);
}

async function getTemplates() {
    let url = "/api/contracts/templates/";
    let r = await makeRequest("GET", url);
    return JSON.parse(r);
}

async function getCounterparties() {
    let url = "/api/counterparties/";
    let r = await makeRequest("GET", url);
    return JSON.parse(r);
}

async function getContract(contract_id) {
    let url = "/api/contracts/"+contract_id;
    let r = await makeRequest("GET", url);
    return JSON.parse(r);
}

async function getContracts() {
    // FIXME: Возвращать контракт
    let url = "/api/contracts/";
    let r = await makeRequest("GET", url);
    return JSON.parse(r);
}


// FIXME: Две функции внизу делают почти что одно и то же
// МБ их как то совместить можно будет 
async function createContract(contract) {
    let url = "/api/contracts/";
    let r = await makeRequest("POST", url, csrftoken, contract);
    return JSON.parse(r);
}

// FIXME: Тут мб надо не /api/contracts/1 а /api/contract/1 хз
async function updateContract(contract_id, contract) {
    let url = "/api/contracts/"+contract_id+"/";
    let r = await makeRequest("PUT", url, csrftoken, contract);
    return r
}


async function approveContract(contract_id) {
    /* Согласует контракт. Меняет статус контракта на фронте*/
    let r = await makeRequest("PUT", '/api/contracts/approve/',
        csrftoken, "contract="+contract_id);
    return JSON.parse(r)
}

