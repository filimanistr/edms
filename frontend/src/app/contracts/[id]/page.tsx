import Header from "@/components/header";
import { getContract, updateContract, getKeyFields } from "../api";
import {PlateEditor} from "@/components/plate-editor";
import {ContractActions} from "@/app/contracts/[id]/actions";

export default async function ContractPage({params}: any) {
  const page: string = "/contracts";
  const data = await getContract(params.id);

  return (
    <>
      <Header page={page}/>
      <main className="flex-auto min-h-screen max-w-[1066px] mx-auto flex-col items-center justify-between pb-24 px-24 pt-12">
        <div className="text-lg font-semibold">
          {data.name}<br/>
        </div>

        <p className="text-sm text-muted-foreground">
          Контрагент: {data.counterparty__name}
          <br/>
          {data.status}
          <br/>
          {data.year}
          <br/>
          <br/>
        </p>

        <PlateEditor text={data.contract} userData={data.keys}>
          <ContractActions data={data} update={updateContract}/>
        </PlateEditor>
      </main>
    </>
  );
}