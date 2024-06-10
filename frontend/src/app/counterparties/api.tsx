import { HOST } from "@/config";
import {
  makeGetRequest
} from "@/api";

const PATH: string = "api/counterparties/";
const URL: string = HOST + PATH;

export async function getCounterparties()  {
  return await makeGetRequest(URL);
}

export async function getCounterparty(id: number)  {
  return await makeGetRequest(URL+id+'/');
}
