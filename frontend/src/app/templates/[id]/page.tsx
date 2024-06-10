import Header from "@/components/header";
import { getTemplate, updateTemplate } from "../api";
import {PlateEditor} from "@/components/plate-editor";
import {TemplateActions} from "@/app/templates/[id]/actions";

export default async function TemplatePage({params}: any) {
  const page: string = "/templates"
  const data = await getTemplate(params.id)

  return (
    <>
      <Header page={page}/>
      <main
        className="flex-auto min-h-screen max-w-[1066px] mx-auto flex-col items-center justify-between px-24 pb-24 pt-12">
        <div className="text-lg font-semibold">
          {data.data.name}<br/>
        </div>

        <p className="text-sm text-muted-foreground">
          Услуга: {data.data.service__name} <br/><br/>
        </p>

        <PlateEditor text={data.data.template}>
          <TemplateActions data={data.data} update={updateTemplate}/>
        </PlateEditor>
      </main>
    </>
  );
}