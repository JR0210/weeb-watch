"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import useDebounceFetch from "../hooks/useDebounceFetch";

import { type ApiResponse } from "../types/global";

type FetchProps = {
  data: ApiResponse;
  loading: boolean;
  error: boolean;
};

const SearchDropdown = ({ children }: { children: React.ReactNode }) => (
  <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
    {children}
  </ul>
);

export default function AnimeSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const url = query
    ? `/api/anime-search?q=${encodeURIComponent(query)}&sfw`
    : "";

  const validate = useCallback(() => query.length >= 3, [query]);

  const { data, loading, error }: FetchProps = useDebounceFetch({
    url,
    delay: 300,
    validate,
  });

  const responseData = data?.data || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const renderResults = () => {
    if (loading)
      return <li className="text-slate-700 py-2 px-4">Loading...</li>;
    if (error)
      return (
        <li className="text-slate-700 py-2 px-4">Error loading results</li>
      );
    if (responseData.length === 0)
      return <li className="text-slate-700 py-2 px-4">No results found</li>;

    return responseData.map((item) => (
      <li
        key={item.mal_id}
        className="group relative cursor-pointer select-none py-2 px-4 text-slate-700 hover:bg-indigo-600 hover:text-white"
      >
        <Link href={`/anime/${item.mal_id}`}>
          <span className="block truncate font-normal">
            {item.title}
            <br />
            {item.title_english}
          </span>
        </Link>
      </li>
    ));
  };

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="mt-2">
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Enter an anime title... (min 3 characters)"
          className="block w-full rounded-md border-0 p-4 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {isFocused && query.length >= 3 && (
          <SearchDropdown>{renderResults()}</SearchDropdown>
        )}
      </div>
    </div>
  );
}
