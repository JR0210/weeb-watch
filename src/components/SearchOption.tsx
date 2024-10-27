import Image from "next/image";
import Link from "next/link";

import { AnimeData } from "../types/global";

export default function SearchOption({ item }: { item: AnimeData }) {
  return (
    <li
      key={item.mal_id}
      className="group h-16 relative cursor-pointer select-none py-2 px-4 text-slate-700 hover:bg-indigo-600 hover:text-white"
    >
      <Link href={`/anime/${item.mal_id}`}>
        <div className="grid grid-cols-search-input w-full h-full gap-2 items-center">
          <Image
            src={item.images.jpg.image_url}
            alt={item.title}
            height={30}
            width={30}
          />
          <div className="flex flex-grow  items-center justify-between">
            <span>{item.title}</span>
            <span className="hidden group-hover:block">View Details</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
