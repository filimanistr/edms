import {redirect} from "next/navigation";

// Главная страница, в будущем возможно добавление какой то общей информации


export default function Home() {
  redirect("contracts/")
}
