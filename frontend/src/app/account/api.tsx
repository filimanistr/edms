"use server"

import { cookies } from "next/headers";
import { HOST } from "@/config";
import {
  makePostRequest,
} from "@/api";
import { redirect } from 'next/navigation'

const PATH: string = "api/accounts/";
const URL: string = HOST + PATH;

export async function getToken(user: object) {
  /* Аутентификация */

  // Получает с сервера токен
  // Сохраняет в куки
  // Если все успешно возвращает true
  // Если не очень - текст с ошибками

  const res = await fetch(URL+"login/", {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(user),
      cache: 'no-store'
    }
  )

  let data = await res.json();
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

export async function logOut() {
  await makePostRequest(URL+"logout/")
  cookies().delete('token')
  redirect("account/auth/")
}

export async function createCounterparty(data: object) {
  const res = await fetch(URL+"register/", {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(data),
      cache: 'no-store'
    }
  )

  let r = await res.json();

  if (r.hasOwnProperty('token')) {
    cookies().set({
      name: 'token',
      value: r.token,
      httpOnly: true,
      maxAge: 60*60*24*28,
      path: '/',
    })
    return true;
  } else {
    return r;
  }
  
}
