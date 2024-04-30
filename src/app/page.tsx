import Image from "next/image";
import Itens from "./components/ui/items/page";
import SearchItem from "./components/ui/search/page";
import ItensCart from "./components/ui/cart/page";

export default function Home() {
  return (
    <>
    <div className="flex items-center justify-center">
    <Image
      src={'/logo.png'}
      alt="Logo"
      width={80}
      height={80}/>
      <SearchItem/>
    </div>
    <Itens/>
    <ItensCart/>
    </>
  );
}
