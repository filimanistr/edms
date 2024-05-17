import Header from "@/components/header";
import { getContract, updateContract } from "../api";
import { ContractEditor } from "./editor";
import { getCounterparty } from "../../counterparties/api"

export default async function ContractPage({params}: any) {
  const page: string = "/contracts"
  const data = await getContract(params.id)

  // TODO: Мдаааааааааааааааааааа :/
  const userData = await getCounterparty(data.counterparty__id);
  userData["service__name"] = data.template__service__name
  userData["contract__name"] = data.name

  return (
    <>
      <Header page={page}/>
      <main className="flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between px-24 pb-24 pt-12">
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

        <ContractEditor
          text={data.contract}
          data={data}
          userData={userData}
          update={updateContract}
        />
      </main>
    </>
  );
}