"use server"

import {Contract} from "@/components/table/columns";
import {makeGetRequest, makePostRequest, makePutRequest} from "@/api";

const url: string = "http://localhost:8000/api/contracts/"

export async function getContracts(): Promise<Contract[]> {
  return await makeGetRequest(url)
}

export async function getContract(id: number)  {
  return await makeGetRequest(url+id+'/')
}

export async function createNewContract(data: object) {
  return await makePostRequest(url, data);
}

export async function updateContract(id: number, data: object)  {
  await makePutRequest(url+id+"/", data)
}

export async function getFields() {
  /* Поля что нужны для создания контракта */
  return await makeGetRequest(url+"fields/")
}
