import List from "./search_list";
import { API_URL } from "../constants";
import { useState } from "react";

const Search = ({setIsSearching}) => {
  const [list, setList] = useState([]);
  const OnChange = (searchText) => {
    if (searchText.replaceAll(" ", "") === "") {
      setList([]);
      setIsSearching(false)
      return;
    }
    (async () => {
      const response = await fetch(`${API_URL}/place/${searchText}`);
      const places = await response.json();
      setList(places.map((place) => place["place"]));
      setIsSearching(true)
    })();
  };
  const OnClick = (searchText) => {
    document.location.href = "place/" + searchText;
  };
  return (
    <div>
      <h1 className="font-semibold text-2xl text-gray-900">
        믿을만한 리뷰인지 궁금하다면
      </h1>
      <div className="mt-4 rounded-lg border-indigo-800 border-2 flex px-4 py-2 shadow-md">
        <input
          placeholder="음식점 이름으로 검색"
          className="font-medium text-lg w-full border-none border-0 bg-transparent focus:outline-none appearance-none"
          id="searchText"
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              OnClick(document.getElementById("searchText").value);
            }
          }}
          onChange={() => {
            OnChange(document.getElementById("searchText").value);
          }}
        />
        <button
          onClick={() => {
            OnClick(document.getElementById("searchText").value);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
      <List param={list} />
    </div>
  );
};

export default Search;
