"use server"

import { HOST } from "@/config";
import {
  makeGetRequest,
  makePostRequest
} from "@/api";

const PATH: string = "api/services/";
const URL: string = HOST + PATH;

export async function getServices()  {
  return await makeGetRequest(URL)
}

export async function getService(id: number)  {
  return await makeGetRequest(URL+id+'/')
}

export async function createService(data: object) {
  return await makePostRequest(URL, data);
}



