"use server"

import {makeGetRequest, makePostRequest, makePutRequest, MakePatchRequest} from "@/api";

const url: string = "http://localhost:8000/api/templates/"

export async function getTemplates()  {
  return await makeGetRequest(url)
}

export async function getTemplate(id: number) {
  return await makeGetRequest(url+id+'/')
}

export async function createNewTemplate(data: object) {
  return await makePostRequest(url, data);
}

export async function updateTemplate(id: number, data: object)  {
  await MakePatchRequest(url+id+"/", data)
}
