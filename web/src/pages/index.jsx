import Header from "../components/Header";
import Search from "../components/search";
import { useState } from "react";

const IndexPage = () => {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="w-full gap-10">
      <Header back={false} />
      <Search setIsSearching={setIsSearching} />
      {!isSearching && (
        <div className="mt-10">
          <span className="font-semibold text-2xl text-gray-900">
            주변 인기 맛집 찾기 👀
          </span>
          <div className="mt-4 flex flex-col gap-4">
            <a
              href="https://www.google.com/maps/search/%EC%8B%A0%EC%B4%8C+%EB%A7%9B%EC%A7%91/data=!3m1!4b1"
              className="relative shadow-md"
            >
              <img className="" alt="picture" src="mapo.png" />
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60" />
              <div className="absolute top-[90px] left-[40px]">
                <span className="font-medium text-white text-3xl">
                  신촌 맛집 둘러보기 🍜
                </span>
              </div>
            </a>
            <a
              href="https://www.google.com/maps/search/%ED%99%8D%EB%8C%80%EB%A7%9B%EC%A7%91/data=!3m1!4b1"
              className="relative shadow-md"
            >
              <img className="" alt="picture" src="daepo.png" />
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60" />
              <div className="absolute top-[90px] left-[40px]">
                <span className="font-medium text-white text-3xl">
                  홍대 맛집 둘러보기 🍜
                </span>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
