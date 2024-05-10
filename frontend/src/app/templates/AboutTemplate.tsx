
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {getTemplate} from "./api";
import {DownloadButton, EditButton, HistoryButton, WatchButton} from "@/components/buttons";
import {EditTemplateWindow} from "@/components/windows/edit-window";
import {Button} from "@/components/ui/button";

export async function AboutTemplateWindow(props: any) {
  // key={row.id}
  // data={data}
  // page={page}>
  const index = props.children.key;
  const old_data = props.data;
  const template_index = old_data[index].id;
  const new_data = await getTemplate(template_index)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {props.children}
      </DialogTrigger>
      <DialogContent
        className="overflow-y-scroll max-h-screen focus-visible:outline-none sm:max-w-[425px]"
        onOpenAutoFocus={async (event) => {
        event.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle>{new_data.name}</DialogTitle>
          <DialogDescription>
            Услуга: {new_data.service__name} <br/><br/>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full">
            <WatchButton/>

            <EditTemplateWindow template_id={new_data.id}>
              <EditButton/>
            </EditTemplateWindow>

            <DownloadButton/>
            <HistoryButton/>
            {/* <DeleteButton/> */}
          </div>

          <Button type="submit">Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}