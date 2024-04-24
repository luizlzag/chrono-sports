import Image from "next/image";
import Itens from "./components/items/page";
import SearchItem from "./components/ui/search/page";

export default function Home() {
  return (
    <>
    <SearchItem/>
    <Itens/>
    </>
  );
}
