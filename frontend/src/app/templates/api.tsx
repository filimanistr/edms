"use server"

import { HOST } from "@/config";
import {
  makeGetRequest,
  makePostRequest,
  MakePatchRequest
} from "@/api";

const PATH: string = "api/templates/";
const URL: string = HOST + PATH;

export async function getTemplates()  {
  return await makeGetRequest(URL)
}

export async function getTemplate(id: number) {
  return await makeGetRequest(URL+id+'/')
}

export async function createNewTemplate(data: object) {
  return await makePostRequest(URL, data);
}

export async function updateTemplate(id: number, data: object)  {
  await MakePatchRequest(URL+id+"/", data)
}
