import { DataTable } from "@/components/table/data-table";
import Header from "@/components/header";
import {columns} from "@/components/table/columns";
import {getCounterparties} from "@/tokens";


export default function Page() {
  const data = getCounterparties()

  return (
    <>
      <Header page="/counterparties"/>
      <main className="flex min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        <DataTable columns={columns} data={data}/>
      </main>
    </>
  );
}

