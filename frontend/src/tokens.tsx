"use server"

import { cookies } from 'next/headers'
import { Contract } from "@/components/table/columns"

// TODO: Этот код должен остаться только на сервере, это еще надо проверить


/* GET запросы */

export async function getContract(id: number)  {
  return await makeGetRequest("http://localhost:8000/api/contracts/"+id+"/");
}

export async function getContracts(): Promise<Contract[]>  {
  return await makeGetRequest("http://localhost:8000/api/contracts/");
}

export async function getCounterparties()  {
  return await makeGetRequest("http://localhost:8000/api/counterparties/");
}

export async function getTemplates()  {
  return await makeGetRequest("http://localhost:8000/api/templates/");
}

export async function getServices()  {
  return await makeGetRequest("http://localhost:8000/api/services/");
}


export async function getFields() {
  return await makeGetRequest("http://localhost:8000/api/contracts/fields/");
}


/* POST запросы */

export async function createNewContract() {
  // TODO: Тут нужен пост запрос
  return await makeGetRequest("http://localhost:8000/api/contracts/");
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

async function getToken(user: object) {
  // Получает с сервера токен, т.е. регистрирует пользователя
  // Если все успешно возвращает true
  // Если не очень - текст с ошибками

  const res = await fetch("http://localhost:8000/api/accounts/login/", {
      method: "POST",
      headers: {"Content-type": "application/json"},
      credentials: 'include',
      body: JSON.stringify(user),
      cache: 'no-store'
    }
  )

  let data = await res.json();
  if (data.hasOwnProperty('token')) {
    return true;
  } else {
    return data;
  }
}

