"use server"

import { cookies } from "next/headers";
import { HOST } from "@/config";

const PATH: string = "api/accounts/login/";
const URL: string = HOST + PATH;

export async function getToken(user: object) {
  /* Аутентификация */

  // Получает с сервера токен
  // Сохраняет в куки
  // Если все успешно возвращает true
  // Если не очень - текст с ошибками

  const res = await fetch(URL, {
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