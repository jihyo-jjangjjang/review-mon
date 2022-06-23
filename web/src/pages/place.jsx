import { Link, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import Rating from "../components/Rating";
import Header from "../components/Header";
import { UserCircleIcon } from "@heroicons/react/solid";
import { getRingByCredibility } from "../utils";
import { API_URL } from "../constants";
import ReactLoading from "react-loading";

const PlacePage = () => {
  const { place } = useParams();
  const [reviewList, setReviewList] = useState([]);
  const [userRating, setter] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [userID, setUserID] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateReviews = useCallback(async () => {
    let response = await fetch(`${API_URL}/review/place/${place}`);
    const reviews = await response.json();
    setReviewList(reviews);
  }, []);

  const OnClick = useCallback(async () => {
    const review = {
      rating: userRating,
      user: userID,
      comment: reviewContent,
      place: place,
    };
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });
      if (!response.ok) throw new Error();
      alert("등록되었습니다.");
    } catch (e) {
      alert("서버 오류입니다.");
    }
    setIsLoading(false);
    await updateReviews();
  }, []);

  useEffect(() => {
    (async () => {
      await updateReviews();
    })();
  }, []);

  return (
    <div>
      <Header back={true} />
      <h1 className="font-bold text-2xl text-gray-900">{place}</h1>
      <h2 className="mt-4 font-semibold text-xl text-gray-900">리뷰 작성</h2>
      <div className="h-52 pt-2">
        {isLoading && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <ReactLoading type="bubbles" color="#3730a3" />
            <span className="font-medium text-gray-600">
              리뷰 신뢰성 계산 중
            </span>
          </div>
        )}
        {!isLoading && (
          <div className="rounded-lg border-indigo-800 border-2 flex flex-col justify-center content-center">
            <div className="flex border-b-2 p-2 place-items-center">
              <Rating setter={setter} userRating={userRating} />
              <span className="ml-4 font-semibold">{userRating} / 5 점</span>
            </div>
            <textarea
              className="w-full appearance-none p-2 focus:outline-none border-b-2"
              rows={4}
              placeholder="서로를 배려하는 마음을 담아 작성해 주세요"
              autoComplete="off"
              name="reviewContent"
              value={reviewContent}
              onChange={({ target: { value } }) => setReviewContent(value)}
            />
            <div className="flex justify-between bg-transparent">
              <input
                placeholder="닉네임을 입력하세요."
                className="p-2 focus:outline-none bg-transparent"
                type="text"
                name="UserID"
                autoComplete="off"
                value={userID}
                onChange={({ target: { value } }) => setUserID(value)}
              />
              <button
                className="bg-indigo-800 text-white px-4 py-2"
                onClick={OnClick}
              >
                등록
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 text-xl font-semibold">
        <span className="">전체</span>
        <span className="ml-2 text-indigo-800">{reviewList.length}</span>
      </div>
      {reviewList.length > 0 && (
        <div className="mt-2 divide-y-2 border-gray-200 border-y-2">
          {reviewList.map(
            (
              { user, place, comment, rating, credibility, created_at },
              idx
            ) => (
              <div key={idx} className="w-full p-2 flex">
                <div className="w-10 mt-2">
                  <UserCircleIcon
                    className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                      credibility
                    )} rounded-full`}
                  />
                </div>
                <div className="ml-4 flex flex-col gap-1">
                  <Rating rating={rating} />
                  <span className="text-md">{comment}</span>
                  <div>
                    <Link
                      to={`/user/${user}`}
                      className="text-sm text-gray-400 hover:underline hover:text-gray-900"
                    >
                      {user}
                    </Link>
                    <span className="text-sm text-gray-400">
                      {" "}
                      | {new Date(created_at).toLocaleDateString()} | 신고
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
      {reviewList.length === 0 && (
        <div className="mt-2">
          <span className="text-lg text-gray-400">리뷰가 없습니다.</span>
        </div>
      )}
    </div>
  );
};

export default PlacePage;
