"use server"

import { HOST } from "@/config";
import {
  makeGetRequest,
  MakePatchRequest
} from "@/api";

export async function getCounterparties()  {
  return await makeGetRequest(HOST + "api/counterparties/");
}

export async function getCounterparty()  {
  return await makeGetRequest(HOST + "api/counterparty/");
}

export async function updateCounterparty(data: object) {
  return await MakePatchRequest(HOST + "api/counterparties/", data)
}
