
var currentForm = 0;
var registrationFields = [];
getRegistrationFields(buildRegForm);

// FIXME: Все это на Vue бы переписать 

function getRegistrationFields(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/accounts/get/fields')
    xhr.send();

    xhr.onload = function() {
        let responseObj = xhr.response;
        registrationFields = JSON.parse(responseObj);
        callback();
    }
}

function buildFieldForm(field, field_name) {
    let input_field_wrapper = document.createElement('div');
    input_field_wrapper.setAttribute('class','input-field-wrapper');
    let input = document.createElement('input');
    input.setAttribute('placeholder', field_name)
    input.setAttribute('id', 'id_'+field);
    input.setAttribute('name', field);
    if (field == "password1" || field == "password2") 
        input.type = "password";
    else 
        input.type = 'text';
    input_field_wrapper.appendChild(input);
    return input_field_wrapper;
}

function buildRegForm() {
    // console.log(registrationFields[0])
    let form = document.getElementById('auth-form')
    for (let fields in registrationFields) {
        let fields_wrapper = document.createElement('div');
        fields_wrapper.setAttribute('class','fields-wrapper');
        for (let field in registrationFields[fields]) {
            field_name = registrationFields[fields][field];
            input_field_wrapper = buildFieldForm(field, field_name);
            fields_wrapper.appendChild(input_field_wrapper);
        }
        fields_wrapper.style.display = 'none';
        form.appendChild(fields_wrapper);
    }
    showForm(currentForm);
}

function showForm(form_id) {
    let forms = document.getElementsByClassName("fields-wrapper");
    forms[currentForm].style.display = "none";
    forms[form_id].style.display = "block";
    currentForm = form_id;

    prev_button = document.getElementById("prev");
    next_button = document.getElementById("next");
    auth_button = document.getElementById("auth");
    if (currentForm < registrationFields.length-1) {
        document.getElementById("step1").style.color = "#4835d4";
        document.getElementById("step2").style.color = "#000";
        next_button.style.display = "block";
        auth_button.style.display = "none";
        prev_button.style.display = "none";
    } else {
        document.getElementById("step2").style.color = "#4835d4";
        document.getElementById("step1").style.color = "#000";
        next_button.style.display = "none";
        auth_button.style.display = "block";
        prev_button.style.display = "block";
    }
}

function switchForm(side) {
    if (side == "next")
        showForm(currentForm + 1)
    else 
        showForm(currentForm - 1)
}
