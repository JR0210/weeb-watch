import Image from "next/image";
import Link from "next/link";

import { AnimeData } from "../types/global";

export default function SearchOption({ item }: { item: AnimeData }) {
  return (
    <li
      key={item.mal_id}
      className="group h-20 relative cursor-pointer select-none py-2 px-4 text-slate-700 hover:bg-indigo-600 hover:text-white"
    >
      <Link href={`/anime/${item.mal_id}`}>
        <div className="grid grid-cols-search-input w-full h-full gap-2 items-center">
          <Image
            src={item.images.jpg.image_url}
            alt={item.title}
            height={30}
            width={30}
          />
          <div className="flex flex-grow items-center justify-between overflow-hidden">
            {/* Container for the titles */}
            <div className="flex flex-col w-full overflow-hidden">
              {/* Main title with ellipsis and tooltip */}
              <span
                className="font-bold truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
                title={item.title}
              >
                {item.title}
              </span>
              {item.title_english && item.title !== item.title_english && (
                <span
                  className="text-sm text-slate-500 group-hover:text-slate-300 truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
                  title={item.title_english}
                >
                  {item.title_english}
                </span>
              )}
              {item.title_japanese && item.title !== item.title_japanese && (
                <span
                  className="text-sm text-slate-500 group-hover:text-slate-300 truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
                  title={item.title_japanese}
                >
                  {item.title_japanese}
                </span>
              )}
            </div>
            {/* View Details button */}
            <span className="hidden group-hover:block whitespace-nowrap">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
