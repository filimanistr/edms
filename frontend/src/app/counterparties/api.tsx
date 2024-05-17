import {makeGetRequest} from "@/api";

const url: string = "http://localhost:8000/api/counterparties/";

export async function getCounterparties()  {
  return await makeGetRequest(url);
}

export async function getCounterparty(id: number)  {
  return await makeGetRequest(url+id+'/');
}

