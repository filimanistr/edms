import Header from "@/components/header";
import { DataTable } from "@/components/table/data-table";
import { Contract, columns } from "@/components/table/columns"
import {getContracts} from "./api"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function ContractsPage() {
  const data: Contract[] = await getContracts();
  const page: string = "/contracts"

  return (
    <>
      <Header page={page}/>

      <main className="px-24 pb-24 pt-12 flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight pb-4">
          Договоры
        </h3>
        { data && <DataTable columns={columns} data={data} page={page}/> }
      </main>
    </>
  );
}
