"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { Input } from "@headlessui/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import SearchOption from "./SearchOption";
import useDebounceFetch from "../hooks/useDebounceFetch";

import {
  type ApiResponse,
  type AnimeData,
  type Pagination,
} from "../types/global";

type FetchProps = {
  data: ApiResponse;
  loading: boolean;
  error: boolean;
};

const SearchDropdown = ({ children }: { children: React.ReactNode }) => (
  <ul className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
    {children}
  </ul>
);

export default function AnimeSearch() {
  const virtuosoRef = useRef(null);

  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [animeData, setAnimeData] = useState<AnimeData[]>([]);
  const [pageData, setPageData] = useState<Pagination>();

  const url = query
    ? `/api/anime-search?q=${encodeURIComponent(query)}&sfw`
    : "";

  const validate = useCallback(() => query.length >= 3, [query]);

  const { data, loading, error }: FetchProps = useDebounceFetch({
    url,
    delay: 300,
    validate,
  });

  const handleScrollPositionChange = (scrollTop: number) => {
    setScrollPosition(scrollTop);
  };

  useEffect(() => {
    if (data) {
      setAnimeData(data.data);
      setPageData(data.pagination);
    }
  }, [data]);

  useEffect(() => {
    const shouldScroll =
      isFocused && animeData.length > 0 && scrollPosition !== 0;
    if (virtuosoRef.current && shouldScroll) {
      const virtuoso: VirtuosoHandle = virtuosoRef.current;
      virtuoso.scrollTo({
        top: scrollPosition,
      });
    }
  }, [isFocused]);

  const loadMore = async () => {
    if (pageData?.has_next_page && !isLoading) {
      setIsLoading((prev) => {
        if (prev) return prev;
        return true;
      });

      try {
        const res = await fetch(
          `/api/anime-search?q=${encodeURIComponent(query)}&page=${
            pageData.current_page + 1
          }&sfw`
        );
        const json = await res.json();
        setAnimeData((prevAnimeData) => [...prevAnimeData, ...json.data]);
        setPageData(json.pagination);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setIsDirty(inputValue !== "");
    setQuery(inputValue);
    setScrollPosition(0);
  };

  const renderResults = () => {
    if (loading)
      return <li className="text-slate-700 py-2 px-4">Loading...</li>;
    if (error)
      return (
        <li className="text-slate-700 py-2 px-4">Error loading results</li>
      );
    if (animeData.length === 0)
      return <li className="text-slate-700 py-2 px-4">No results found</li>;

    return (
      <Virtuoso
        ref={virtuosoRef}
        initialScrollTop={scrollPosition}
        onScroll={(e: any) => handleScrollPositionChange(e.target.scrollTop)}
        data={animeData}
        endReached={loadMore}
        style={{ height: "15rem" }}
        increaseViewportBy={12}
        fixedItemHeight={80}
        itemContent={(index) => {
          const item = animeData[index];
          return <SearchOption item={item} />;
        }}
      />
    );
  };

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="mt-2">
        {/* Wrap input and dropdown in a relative container */}
        <div className="relative">
          <div className="relative">
            <Input
              id="search"
              name="search"
              type="text"
              autoComplete="off"
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
            {isLoading && (
              <ArrowPathIcon className="absolute top-1/3 right-2 animate-spin flex items-center h-5 w-5 text-slate-700" />
            )}
          </div>
          {query.length >= 3 && isFocused && (
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
