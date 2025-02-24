import Image from "next/image";
import Link from "next/link";

import { AnimeData } from "../types/global";

const genericTitleClasses =
  "transition-all truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-full";

const nonMatchingClasses =
  "font-[400] text-slate-500 group-hover:text-slate-300";

export default function SearchOption({
  item,
  query,
}: {
  item: AnimeData;
  query: string;
}) {
  // Get all possible titles, filter out empty strings and duplicates
  const titlesArr = [
    item.title,
    item.title_english,
    item.title_japanese,
  ].filter((title) => title);
  const titles = [...new Set(titlesArr)];

  // Find which title substring matches the query
  const matchedTitle = titles.find((title) =>
    title.toLowerCase().includes(query.toLowerCase())
  );

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
              {titles.map((title: string) => (
                <span
                  key={title}
                  className={`${
                    title === matchedTitle ? "font-[700]" : nonMatchingClasses
                  } ${genericTitleClasses}`}
                  title={title}
                >
                  {title}
                </span>
              ))}
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
