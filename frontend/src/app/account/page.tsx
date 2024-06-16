import Header from "@/components/header";
import { ProfileForm } from "./profile-form"
import { getCounterparty } from "@/app/counterparties/api"
import { ProfileFormValues } from "./types"

export default async function ContractsPage() {
  const data: Partial<ProfileFormValues> = await getCounterparty();
  const page: string = "/account"

  return (
    <>
      <Header page={page}/>

      <main
        className="px-24 pb-24 pt-12 flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight pb-1">
          Настройки
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          Изменения не будут отражаться на существующих договорах
        </p>

        <ProfileForm user={data}/>
      </main>
    </>
  );
}
