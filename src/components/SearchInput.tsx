"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import useDebounceFetch from "../hooks/useDebounceFetch";
import { type ApiResponse } from "../types/global";
import Image from "next/image";
import { Virtuoso } from "react-virtuoso";

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
  const [isDirty, setIsDirty] = useState(false);

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
    if (!isDirty) setIsDirty(true);
    if (isDirty && !e.target.value) setIsDirty(false);
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
          <div className="flex flex-row space-x-2">
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
    ));
  };

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="mt-2">
        {/* Wrap input and dropdown in a relative container */}
        <div className="relative">
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Enter an anime title... (min 3 characters)"
            className={`block w-full rounded-md p-4 shadow-sm sm:text-sm sm:leading-6 ${
              isDirty && !validate()
                ? "border border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                : "border border-gray-300 text-slate-700 placeholder-gray-400 focus:border-indigo-600 focus:ring-indigo-600"
            }`}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={isDirty && !validate()}
            aria-describedby={
              isDirty && !validate() ? "search-error" : undefined
            }
          />
          {query.length >= 3 && (
            <SearchDropdown>{renderResults()}</SearchDropdown>
          )}
        </div>
        {/* Error message container */}
        <div className="mt-2 h-5">
          <p
            className={`text-sm text-red-600 transition-opacity duration-200 ${
              isDirty && !validate() ? "opacity-100" : "opacity-0"
            }`}
            id="search-error"
          >
            Please enter at least 3 characters.
          </p>
        </div>
      </div>
    </div>
  );
}
