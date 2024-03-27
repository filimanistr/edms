
const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
      
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
  

async function addInfoToAboutContractWindow(contract_id) {
    let contract_wrapper = document.querySelector(".contract"+contract_id);
    let h4 = contract_wrapper.querySelector("#contract-template-name")
    let p1 = contract_wrapper.querySelector("#contract-counterpartie")
    let p2 = contract_wrapper.querySelector("#contract-year")

    let win = document.querySelector(".about-contract");
    let head = win.querySelector("#about-contract-header");
    let counterpartie = win.querySelector("#contract-counterpartie")
    let year = win.querySelector("#contract-year")
    head.innerText = h4.innerText;
    counterpartie.innerText = p1.innerText;
    year.innerText = p2.innerText;

    let contract = await getContract(contract_id);
    let file_input = document.getElementById("about-contract-file-input");
    let save_btn = document.getElementById("save-contract");

    // FIXME: Переместить все onclick функции в events.js
    let approve_btn = document.getElementById("approve");
    approve_btn.onclick = async function() {
        r = await approveContract(contract_id);
        console.log("%cUpdate Contract: ", "color:red", r);
        changeContractStatus(contract_id, r.status);
    }

    save_btn.onclick = async function() {
        // Начать скачивание файла
        const blob = b64toBlob(contract.contract, 'doc');
        const blobUrl = URL.createObjectURL(blob);
        save_btn.href = blobUrl;
        save_btn.download = "aDefaultFileName.doc";
    }

    let update_btn = document.getElementById("update-contract");
    update_btn.onclick = function() {
        let file = document.getElementById("about-contract-input").files[0];
        let formData = new FormData();
        formData.append("title", file.name);
        formData.append('file', file);
        updateContract(contract_id, formData)

        let status = '';
        if (user.is_admin) 
            status = "ожидает согласования заказчиком"
        else
            status = "ожидает согласования поставщиком"
        changeContractStatus(contract_id, status);
    }

    let edit_btn = document.getElementById("edit-contract");
    edit_btn.onclick = function() {
        if (approve_btn.style.display == "none") {
            approve_btn.style.display = "block";
            update_btn.style.display = "none";
            file_input.style.display = "none";
            edit_btn.style.backgroundColor = "#FFF";
        } else {
            approve_btn.style.display = "none";
            update_btn.style.display = "block";
            file_input.style.display = "block";
            edit_btn.style.backgroundColor = "#CCC";
        }
        
    }

    if (contract.status === "согласован") {
        approve_btn.style.display = "none";
        edit_btn.style.display = "none";
    } else if ((user.is_admin) & (contract.status === "ожидает согласования заказчиком")) {
        approve_btn.style.display = "none";
        edit_btn.style.display = "none";
    } else if ((user.is_admin === false) & (contract.status === "ожидает согласования поставщиком")) {
        approve_btn.style.display = "none";
        edit_btn.style.display = "none";
    } else {
        approve_btn.style.display = "block";
        edit_btn.style.display = "block";
    }

    /*
    // Просмотр документов тут
    let ccontract = await getContract(contract_id);
    let contract_window = document.querySelector(".contract-edit-window");
    contract_window.innerHTML = ccontract.contract; */
}

async function addInfoToNewContractWindow() {
    // Добавляет поля для заполнения в окно создания контракта
    let counterparties = await getCounterparties();
    let templates = await getTemplates();
    let select_fields = [counterparties, templates];

    let win = document.querySelector(".new-contract-first-fields");
    win.innerText = "";
    for (field of select_fields) {
        let field_wrapper = document.createElement("div");
        win.appendChild(field_wrapper)
        field_wrapper.classList.add("input-field-wrapper")
        
        var selectList = document.createElement("select");
        selectList.id = "select"+select_fields.indexOf(field);
        field_wrapper.appendChild(selectList);
        for (opt of field) {
            var option = document.createElement("option");
            if (field === counterparties) {
                option.text = opt.short_name
                option.value = opt.id_id;
            }
            if (field === templates) {
                option.text = opt.name;
                option.value = opt.id;
            }
            selectList.appendChild(option);
        }
    }
}


// Renders contracts 
getUserInfo().then(user => {
    listContracts(); 
})

// Рисует все договара
async function listContracts() {
    contracts = await getContracts();
    let table = document.querySelector(".contracts-in-table");
    for (let contract of contracts) {
        let row = await drawRow(contract);
        let click = 'onclick="showContractDetails('+contract.id+')"';
        let r = row.slice(0, 4) + click + row.slice(4);
        table.innerHTML += r;
    }
}

// Добавляет новый нарисованный договор
async function addContract(contract_id, row) {
    let table = document.querySelector(".contracts-in-table");
    row.onclick = function()  {
        showContractDetails(contract_id);
    }
    table.innerHTML += row;
}

// Рисует новый контракт на сайте 
async function drawRow(contract) {
    let row = '<tr class="contract'+contract.id+' border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">';
    row += '<td id="contract-id" class="whitespace-nowrap px-6 py-4 font-medium">'+contract.id+'</td>\n';
    row += '<td id="contract-template-name" class="whitespace-nowrap px-6 py-4">'+contract.template__name+'</td>\n';
    row += '<td id="contract-counterpartie" class="whitespace-nowrap px-6 py-4">'+contract.counterpartie__short_name+'</td>\n';
    row += '<td id="contract-template-id" class="whitespace-nowrap px-6 py-4">'+contract.template__id+'</td>\n';
    row += '<td id="contract-status" class="whitespace-nowrap px-6 py-4">'+contract.status+'</td>\n';
    row += '<td id="contract-year" class="whitespace-nowrap px-6 py-4">'+contract.year+'</td>\n';
    row += '</tr>'
    return row 
}


// Изменяет цвет и текст статуса контракта 
function changeContractStatus(contract_id, new_status) {
    let contract = document.querySelector(".contract"+contract_id);
    let status_color = contract.querySelector("#circle-status");
    status_color.style.backgroundColor = getStatusColor(new_status);

    let status_text = contract.querySelector(".inner");
    status_text.innerText = new_status;
}

