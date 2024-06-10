"use server"

import {Contract} from "@/components/table/columns";
import {makeGetRequest, MakePatchRequest, makePostRequest, makePutRequest} from "@/api";

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
  // Обновляет как состояние так и сам контракт
  await MakePatchRequest(url+id+"/", data)
}


export async function getFields() {
  /* Поля что нужны для создания контракта */
  return await makeGetRequest(url+"fields/")
}


export async function createPreviewContract(data: object) {
  return await makePostRequest(url+"preview/", data)
}

export async function savePreviewContract(data: object) {
  return await makePostRequest(url+"save/", data)
}
