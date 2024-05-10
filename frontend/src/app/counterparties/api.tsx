import {cookies} from "next/headers";

const url: string = "http://localhost:8000/api/counterparties/"

export async function getCounterparties()  {
  const cookieStore = cookies()
  const token = cookieStore.get("token")!.value
  const res = await fetch(url, {
    headers: {"Authorization": "Token " + token},
    cache: 'no-cache'
  });

  return await res.json();
}
