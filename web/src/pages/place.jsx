import { Link, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import Rating from "../components/Rating";
import Header from "../components/Header";
import {
  UserCircleIcon,
  ChatAltIcon,
  EmojiHappyIcon,
  EmojiSadIcon,
  FastForwardIcon,
  QuestionMarkCircleIcon,
  HandIcon,
} from "@heroicons/react/solid";
import { getRingByCredibility } from "../utils";
import { API_URL } from "../constants";
import ReactLoading from "react-loading";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

const PlacePage = () => {
  const { place } = useParams();
  const [reviewList, setReviewList] = useState([]);
  const [userRating, setter] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [userID, setUserID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [viewTag, setViewTag] = useState("태그 전체");

  var prevCluster, prevCredibility;

  const updateReviews = useCallback(async () => {
    let response = await fetch(`${API_URL}/review/place/${place}`);
    const reviews = await response.json();
    setReviewList(reviews);
  }, []);

  const resubmitReview = (_review) => {
    const review = {
      rating: _review.rating,
      user: _review.user,
      comment: _review.comment,
      place: _review.place,
      cluster: prevCluster,
      credibility: prevCredibility,
    };

    (async () => {
      try {
        const response = await fetch(`${API_URL}/review/direct`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(review),
        });
        if (!response.ok) throw new Error();
        alert("등록되었습니다.");
        setter(0);
        setReviewContent("");
        setUserID("");
        await updateReviews();
      } catch (e) {
        alert("서버 오류입니다.");
      }
    })();
  };

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
      if (response.status == 400) {
        const detail = await response.json();
        prevCluster = detail["detail"]["cluster"];
        prevCredibility = detail["detail"]["credibility"];

        confirmAlert({
          title: `${detail["detail"]["message"]}`,
          message: "정확한 리뷰와 별점은 큰 도움이 됩니다.",
          buttons: [
            {
              label: "다시 입력할게요",
              onClick: () => {},
            },
            {
              label: "이대로 등록할게요",
              onClick: () => {
                resubmitReview(review);
              },
            },
          ],
        });
      } else {
        if (!response.ok) throw new Error();
        alert("등록되었습니다.");
        setter(0);
        setReviewContent("");
        setUserID("");
      }
    } catch (e) {
      alert("서버 오류입니다.");
    }
    setIsLoading(false);
    await updateReviews();
  }, [userRating, userID, reviewContent, place]);

  useEffect(() => {
    (async () => {
      await updateReviews();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!checked) await updateReviews();
      else
        setReviewList(reviewList.filter((review) => review.credibility >= 80));
    })();
  }, [checked]);

  return (
    <div>
      <Header back={true} />
      <h1 className="font-bold text-2xl text-gray-900">{place}</h1>
      <h2 className="mt-4 font-semibold text-xl text-gray-900">리뷰 작성</h2>
      <div className="h-52 pt-2">
        {isLoading && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <ReactLoading type="bubbles" color="#3730a3" />
            <span className="font-medium text-gray-600">리뷰 분석 중</span>
          </div>
        )}
        {!isLoading && (
          <div className="rounded-lg border-indigo-800 border-2 flex flex-col justify-center content-center shadow-md">
            <div className="flex border-b-2 p-2 place-items-center">
              <Rating setter={setter} userRating={userRating} />
              <span className="ml-4 font-semibold">{userRating} / 5 점</span>
            </div>
            <textarea
              className="w-full appearance-none p-2 focus:outline-none focus:ring-0 focus:border-gray-200 focus:border-b-2 border-0 border-b-2 border-gray-200"
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
                className="p-2 focus:outline-none focus:ring-0 bg-transparent border-0"
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

      <div className="flex justify-between">
        <div className="mt-6 text-xl font-semibold">
          <span className="">전체</span>
          <span className="ml-2 text-indigo-800">{reviewList.length}</span>
        </div>
        <div className="flex gap-2 self-end">
          <span className="font-medium text-md">믿을 수 있는 리뷰만</span>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              setChecked(!checked);
            }}
            className="w-6 h-6 focus:ring-indigo-500 text-indigo-600 border-gray-300 rounded"
          />
        </div>
      </div>
      {reviewList.length > 0 && (
        <div>
          <div className="font-semibold text-2xl flex justify-between mt-2">
            <div className="content-center">
              <span className="text-indigo-800">
                {(
                  reviewList.reduce(
                    (prev, cur) => prev + parseInt(cur.rating),
                    0
                  ) / reviewList.length
                ).toFixed(1)}
              </span>
              <span className=""> / 5 점</span>
            </div>
            <div className="">
              <span className="font-semibold text-indigo-800">#</span>
              <select
                className="w-36 h-10 ml-1 focus:ring-indigo-800"
                onChange={(d) => {
                  setViewTag(d.target.value);
                }}
              >
                <option defaultValue="태그 전체">태그 전체</option>
                <option value="응애">응애</option>
                <option value="언어의 마술사">언어의 마술사</option>
                <option value="긴 말은 안한다">긴 말은 안한다</option>
                <option value="모든 램지">모든 램지</option>
                <option value="박찬호">박찬호</option>
                <option value="아낌없이 주는 사람">아낌없이 주는 사람</option>
              </select>
            </div>
          </div>
          <div className="mt-2 divide-y-2 border-gray-200 border-y-2">
            {reviewList.map(
              (
                { user, place, comment, rating, credibility, created_at, tag },
                idx
              ) => {
                if (viewTag === "태그 전체" || tag === viewTag)
                  return (
                    <div key={idx} className="w-full p-2 flex">
                      <div className="w-10 mt-2">
                        {tag === "응애" && (
                          <HandIcon
                            className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                              credibility
                            )} rounded-full`}
                          />
                        )}
                        {tag === "언어의 마술사" && (
                          <QuestionMarkCircleIcon
                            className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                              credibility
                            )} rounded-full`}
                          />
                        )}
                        {tag === "긴 말은 안한다" && (
                          <FastForwardIcon
                            className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                              credibility
                            )} rounded-full`}
                          />
                        )}
                        {tag === "모든 램지" && (
                          <EmojiSadIcon
                            className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                              credibility
                            )} rounded-full`}
                          />
                        )}
                        {tag === "박찬호" && (
                          <ChatAltIcon
                            className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                              credibility
                            )} rounded-full`}
                          />
                        )}
                        {tag === "아낌없이 주는 사람" && (
                          <EmojiHappyIcon
                            className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                              credibility
                            )} rounded-full`}
                          />
                        )}
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
                  );
              }
            )}
          </div>
        </div>
      )}
      {reviewList.length === 0 && (
        <div className="mt-6">
          <span className="text-lg text-gray-400">리뷰가 없습니다.</span>
        </div>
      )}
    </div>
  );
};

export default PlacePage;
