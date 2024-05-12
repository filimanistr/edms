"use server"

import {cookies} from "next/headers";
import {makeGetRequest, makePostRequest} from "@/api";

const url: string = "http://localhost:8000/api/services/";

export async function getServices()  {
  return await makeGetRequest(url)
}

export async function getService(id: number)  {
  return await makeGetRequest(url+id+'/')
}

export async function createService(data: object) {
  return await makePostRequest(url, data);
}



