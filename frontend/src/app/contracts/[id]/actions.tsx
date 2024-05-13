import {useEditorReadOnly, useEditorRef, usePlateStore} from "@udecode/plate-common";
import {AcceptButton, DeleteButton, HistoryButton, SendToAcceptanceButton} from "@/components/buttons";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {PenLine} from "lucide-react";
import {useState} from "react";

export function ContractActions({data, update}: any) {
  const [show, setShow] = useState(false);

  const editor = useEditorRef()
  const setReadOnly = usePlateStore().set.readOnly();
  const readOnly = useEditorReadOnly();

  // TODO: Я бы как то весь этот бардак пофиксил, но это надо думать долго
  //       задача номер 99999

  function handleUpdateContract() {
    update(data.id, {
      contract: editor.children
    })
  }

  function handleUpdateStatus() {
    // оставляем null потому что статус будет обновляться сервером
    // сам status тут говорит что мы обновляем статус
    update(data.id, {
      status: null,
    })
  }

  return (
    <div className="flex mb-5">
      <div className="flex gap-2">
        <Button
          disabled={
            (
              (data.status === "ожидает согласования поставщиком" && data.role === "user") ||
              (data.status === "ожидает согласования заказчиком" && data.role === "admin") ||
              (data.status === "согласован")
            )
            && true
          }
          variant={readOnly ? "outline" : "default"}
          size="sm"
          onClick={() => {
            setReadOnly(!readOnly)
            setShow(true)
          }}
        >
          <PenLine size={18} className="mr-2 h-4 w-4"/> Редактор
        </Button>

        <HistoryButton/> {/* TODO: Открывать окно истории */}
        {/* data.role === "admin" && <DeleteButton/> */}
      </div>

      <div className="ml-auto flex gap-2">
        <Link replace href="/contracts">
          <Button variant="outline" size="sm">Отмена</Button>
        </Link>

        { data.status === "согласован"
          && <Button size="sm">Сформировать</Button>
        }

        {(
          (data.status === "ожидает согласования поставщиком" && data.role === "admin" && !show) ||
          (data.status === "ожидает согласования заказчиком" && data.role === "user" && !show)
          )
          && <AcceptButton page="/contracts" handle={handleUpdateStatus}/>
        }

        {(data.status === "ожидает согласования поставщиком" && data.role === "admin" && show)
          && <SendToAcceptanceButton page="/contracts" handle={handleUpdateContract}/>
        }

        {(data.status === "ожидает согласования заказчиком" && data.role === "user" && show)
          && <SendToAcceptanceButton page="/contracts" handle={handleUpdateContract}/>
        }

      </div>
    </div>
  )
}
