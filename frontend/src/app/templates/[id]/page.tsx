import Header from "@/components/header";
import { TemplateEditor } from "./editor";
import { getTemplate, updateTemplate } from "../api";

export default async function TemplatePage({params}: any) {
  const page: string = "/templates"
  const data = await getTemplate(params.id)
  // TODO: Edit template name and MAYBE service

  return (
    <>
      <Header page={page}/>
      <main
        className="flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between px-24 pb-24 pt-12">
        <div className="text-lg font-semibold">
          {data.data.name}<br/>
        </div>

        <p className="text-sm text-muted-foreground">
          Услуга: {data.data.service__name} <br/><br/>
        </p>

        <TemplateEditor
          text={data.data.template}
          data={data}
          update={updateTemplate}
        />
      </main>
    </>
  );
}