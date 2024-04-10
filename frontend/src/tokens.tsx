"use server"

import { cookies } from 'next/headers'
import { Contract } from "@/components/table/columns"

// TODO: Этот код должен остаться только на сервере, это еще надо проверить
// TODO: Можно сократить до пары функций указывая что мне надо в параметре
//       get("contracts") get("templates") будет подставлять в url эту строку


/* GET запросы */

/* Контракты */

export async function getContract(id: number)  {
  return await makeGetRequest("http://localhost:8000/api/contracts/"+id+"/");
}

export async function getContracts(): Promise<Contract[]>  {
  return await makeGetRequest("http://localhost:8000/api/contracts/");
}

/* Шаблоны */

export async function getTemplate(id: number) {
  return await makeGetRequest("http://localhost:8000/api/templates/"+id+"/");
}

export async function getTemplates()  {
  return await makeGetRequest("http://localhost:8000/api/templates/");
}

/* Контрагенты */

export async function getCounterparties()  {
  return await makeGetRequest("http://localhost:8000/api/counterparties/");
}

/* Сервисы */

export async function getServices()  {
  return await makeGetRequest("http://localhost:8000/api/services/");
}


export async function getFields() {
  return await makeGetRequest("http://localhost:8000/api/contracts/fields/");
}


/* POST запросы */

export async function createNewContract(data: object) {
  const cookieStore = cookies()
  const token = cookieStore.get("token").value
  return await makePostRequest("http://localhost:8000/api/contracts/", data, token);
}

/* Аутентификация */

export async function getToken(user: object) {
  // Получает с сервера токен, т.е. регистрирует пользователя
  // Сохраняет в куки
  // Если все успешно возвращает true
  // Если не очень - текст с ошибками

  let data = await makePostRequest("http://localhost:8000/api/accounts/login/", user)

  if (data.hasOwnProperty('token')) {
    cookies().set({
      name: 'token',
      value: data.token,
      httpOnly: true,
      maxAge: 60*60*24*28,
      path: '/',
    })
    return true;
  } else {
    return data;
  }
}


/* Общие функции */

async function makeGetRequest(url: string) {
  const cookieStore = cookies()

  const res = await fetch(url, {
    headers: {"Authorization": "Token " + cookieStore.get("token").value},
    cache: 'no-store'
  });

  let data = await res.json();
  return data
}

export async function makePostRequest(url: string, data: object, token: string | null = null) {
  let headers =  {"Content-type": "application/json"}
  if (token !== null) {
    headers["Authorization"] = "Token " + token
  }

  const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
      cache: 'no-store'
    }
  )

  return await res.json();
}

export async function createNewTemplate(formdata) {
  const cookieStore = cookies()
  console.log("something")
  const res = await fetch("http://localhost:8000/api/upload-file/", {
      method: "POST",
      headers: {"Authorization": "Token " + cookieStore.get("token").value},
      body: formdata,
      cache: 'no-store'
    }
  )

  return await res.json();
}
