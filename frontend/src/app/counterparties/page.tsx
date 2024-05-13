import { DataTable } from "@/components/table/data-table";
import Header from "@/components/header";
import {columns} from "@/components/table/columns";
import {getCounterparties} from "./api";

export default async function Page() {
  const data = await getCounterparties();
  const page: string = "/counterparties";

  return (
    <>
      <Header page={page}/>
      <main className="px-24 pb-24 pt-12 flex min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        <DataTable page={page} columns={columns} data={data}/>
      </main>
    </>
  );
}

