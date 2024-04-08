import {redirect} from "next/navigation";

// Главная страница, в будущем возможно добавление какой то общей инфорамции


export default function Home() {
  redirect("contracts/")
}
