import Header from "@/components/header";
import { getContracts } from "@/tokens"

import { DataTable } from "@/components/table/data-table";
import { Contract, columns } from "@/components/table/columns"



export default async function ContractsPage() {
  let data = await getContracts();

  return (
    <>
      <Header page="/contracts"/>

      <main className="flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        <DataTable columns={columns} data={data}/>
      </main>

    </>
  );
}
