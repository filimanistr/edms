import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {getContract} from "../contracts/api";
import {DownloadButton, EditButton, HistoryButton, SendToAcceptanceButton, WatchButton} from "@/components/buttons";
import {EditContractWindow} from "@/components/windows/edit-window";
import {getService} from "@/app/services/api";

export async function AboutServiceWindow(props: any) {
  const index = props.children.key;
  const old_data = props.data;
  const contract_index = old_data[index].id;
  const new_data = await getService(contract_index)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {props.children}
      </DialogTrigger>
      <DialogContent
        className="overflow-y-scroll max-h-screen h-[210px] focus-visible:outline-none sm:max-w-[425px]"
        onOpenAutoFocus={async (event) => {
        event.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle>{new_data.name}</DialogTitle>
          <DialogDescription>
            Контрагент: {new_data.counterparty__name}
            <br/>
            Шаблон: {new_data.template__name}
            <br/>
            {new_data.status}
            <br/>
            {new_data.year}
            <br/>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex w-full">
            <WatchButton onclick={async () => {

            }}/>

            <EditContractWindow>
              <EditButton/>
            </EditContractWindow>

            <DownloadButton onclick={async () => {

            }}/>

            <HistoryButton/>
            {/* <DeleteButton/> */}
          </div>

          <SendToAcceptanceButton/>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}