"use server"

import {cookies} from "next/headers";
import axios from 'axios';

// Общие функции, для избежания повторяемости кода там где это возможно
// Каждый запрос это получение куков и выставление заголовков,
// что можно оптимизировать в 1 функцию и передавать ей URL

export async function makeGetRequest(url: string) {
  const cookieStore = cookies()
  const token = cookieStore.get("token")!.value

  const res = await fetch(url, {
    headers: {"Authorization": "Token " + token},
    cache: 'no-cache'
  });

  return await res.json();
}

export async function makePostRequest(url: string, data: any) {
  const cookieStore = cookies()
  const token = cookieStore.get("token")!.value

  let headers =  {
    "Content-type": "application/json",
    "Authorization": "Token " + token
  }

  const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
      cache: 'no-store'
    }
  )

  // Ошибки в принцепе тоже ловит, если они с сервера идут как JSON
  return await res.json();
}

export async function makePutRequest(url: string, data: any) {
  const cookieStore = cookies()
  const token =  cookieStore.get("token")!.value

  let headers =  {
    "Content-type": "application/json",
    "Authorization": "Token " + token
  }

  const res = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
      cache: 'no-store'
    }
  )
}

export async function MakePatchRequest(url: string, data: any) {
  const cookieStore = cookies()
  const token =  cookieStore.get("token")!.value

  let headers =  {
    "Content-type": "application/json",
    "Authorization": "Token " + token
  }

  const res = await fetch(url, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(data),
      cache: 'no-store'
    }
  )
}
