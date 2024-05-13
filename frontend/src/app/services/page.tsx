import Header from "@/components/header";
import { DataTable } from "@/components/table/data-table";
import { servicesColumns } from "@/components/table/columns";

import { getServices } from "./api";

export default async function Page() {
  const data = await getServices();
  const page: string = "/services"

  return (
    <>
      <Header page={page} is_admin={data.is_admin}/>
      <main className="px-24 pb-24 pt-12 flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        {data && <DataTable columns={servicesColumns} data={data.data} page={page} is_admin={data.is_admin}/>}
      </main>
    </>
  );
}
