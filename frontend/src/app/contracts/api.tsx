"use server"

import { Contract } from "@/components/table/columns";
import { HOST } from "@/config";
import {
  makeGetRequest,
  MakePatchRequest,
  makePostRequest
} from "@/api";

const PATH: string = "api/contracts/";
const URL: string = HOST + PATH;

export async function getContracts(): Promise<Contract[]> {
  return await makeGetRequest(URL)
}

export async function getContract(id: number)  {
  return await makeGetRequest(URL+id+'/')
}

export async function createNewContract(data: object) {
  return await makePostRequest(URL, data);
}

export async function updateContract(id: number, data: object)  {
  // Обновляет как состояние так и сам контракт
  await MakePatchRequest(URL+id+"/", data)
}


export async function getFields() {
  /* Поля что нужны для создания контракта */
  return await makeGetRequest(URL+"fields/")
}


export async function createPreviewContract(data: object) {
  return await makePostRequest(URL+"preview/", data)
}

export async function savePreviewContract(data: object) {
  return await makePostRequest(URL+"save/", data)
}
