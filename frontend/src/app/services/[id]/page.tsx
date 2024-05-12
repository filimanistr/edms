import Header from "@/components/header";
import {getServices} from "../api";

export default async function ServicePage({params}: any) {
  // Пока что только так, потом исправить
  let data = await getServices();
  data = data.data.find((x: any) => x.id == params.id)
  const page: string = "/services";

  return (
    <>
      <Header page={page}/>

      <main className="flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        <div className="text-lg font-semibold">
          {data.name}<br/>
        </div>

        <p className="text-sm text-muted-foreground">
          Цена: {data.price}
          <br/>
          Год: {data.year}
          <br/>
          <br/>
        </p>
      </main>
    </>
  );
}

