"use client";

import React, { useState, useRef, useEffect } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { Input } from "@headlessui/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { useInfiniteQuery } from "@tanstack/react-query";

import SearchOption from "./SearchOption";
import { fail } from "assert";

function determineDropdownHeight(dataCount: number) {
  const height = dataCount * 80;
  if (dataCount > 3) return "15rem";
  return `${height}px`;
}

const SearchDropdown = ({ children }: { children: React.ReactNode }) => (
  <ul className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
    {children}
  </ul>
);

export default function AnimeSearch() {
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 100); // Adjust the delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const fetchAnime = async ({
    pageParam = 1,
    signal,
  }: {
    pageParam?: number;
    signal: AbortSignal;
  }) => {
    const res = await fetch(
      `/api/anime-search?q=${encodeURIComponent(query)}&page=${pageParam}&sfw`,
      { signal }
    );
    const data = await res.json();

    if (data.status === "429") {
      const error = new Error(data.message);
      error.name = "RateLimitException";
      throw error;
    }

    if (!data || !res.ok) {
      return { data: [], pagination: { has_next_page: false } };
    }

    return data;
  };

  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["animeSearch", debouncedQuery],
      queryFn: fetchAnime,
      enabled: debouncedQuery.length >= 3,
      getNextPageParam: (lastPage) =>
        lastPage?.pagination?.has_next_page
          ? lastPage.pagination?.current_page + 1
          : undefined,
      initialPageParam: 1,
      retry: (failureCount, error) => {
        if (error.name === "RateLimitException") {
          return failureCount < 3;
        }
        return false;
      },
      retryDelay: (failureCount) => Math.min(failureCount * 300, 2000),
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setIsDirty(inputValue !== "");
    setQuery(inputValue);
    setScrollPosition(0);
  };

  const renderResults = () => {
    if (isLoading)
      return <li className="text-slate-700 py-2 px-4">Loading...</li>;
    if (isError)
      return (
        <li className="text-slate-700 py-2 px-4">Error loading results</li>
      );
    const animeData = data?.pages.flatMap((page) => page.data) || [];
    if (animeData.length === 0)
      return <li className="text-slate-700 py-2 px-4">No results found</li>;

    return (
      <Virtuoso
        ref={virtuosoRef}
        initialScrollTop={scrollPosition}
        onScroll={(e: any) => setScrollPosition(e.target.scrollTop)}
        data={animeData}
        endReached={() => hasNextPage && fetchNextPage()}
        style={{ height: determineDropdownHeight(animeData.length) }}
        increaseViewportBy={12}
        fixedItemHeight={80}
        itemContent={(index) => <SearchOption item={animeData[index]} />}
      />
    );
  };

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="mt-2 relative">
        <Input
          id="search"
          name="search"
          type="text"
          autoComplete="off"
          placeholder="Enter an anime title... (min 3 characters)"
          className={`block w-full rounded-md p-4 shadow-sm sm:text-sm sm:leading-6 ${
            isDirty && query.length < 3
              ? "border border-red-300 text-red-900 placeholder-red-300"
              : "border border-gray-300 text-slate-700 placeholder-gray-400"
          }`}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={isDirty && query.length < 3}
          aria-describedby={
            isDirty && query.length < 3 ? "search-error" : undefined
          }
        />
        {isLoading && (
          <ArrowPathIcon className="absolute top-1/3 right-2 animate-spin h-5 w-5 text-slate-700" />
        )}
        {query.length >= 3 && isFocused && (
          <SearchDropdown>{renderResults()}</SearchDropdown>
        )}
        <div className="mt-2 h-5">
          <p
            className={`text-sm text-red-600 transition-opacity ${
              isDirty && query.length < 3 ? "opacity-100" : "opacity-0"
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
