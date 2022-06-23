import { useParams } from "react-router-dom";
import React, { useState, ReactElement, useEffect } from "react";
import Rating from "../components/Rating";
import Header from "../components/Header";

const PlacePage = () => {
  const { place } = useParams();
  const [userRating, setter] = useState(1);
  const [reviewContent, setReviewContent] = useState("");
  const [userID, setUserID] = useState("");
  const [disabled, setDisabled] = useState(false);

  const OnClick = () => {
    var review = {
      rating: userRating,
      user: userID,
      comment: reviewContent,
      place: place,
    };
    console.log(review);
  };

  return (
    <div>
      <Header back={true}></Header>
      <h1 className="font-bold text-2xl text-gray-900">{place}</h1>
      <h2 className="mt-8 font-bold text-xl text-gray-900">리뷰 작성</h2>
      <div className="mt-2 rounded-lg border-blue-800 border-2 flex flex-col justify-center content-center">
        <div className="flex border-b-2 p-2">
          <Rating setter={setter} userRating={userRating}></Rating>
          <div className="ml-4">{userRating} / 5점</div>
        </div>
        <textarea
          className="w-full appearance-none p-2 focus:outline-none border-b-2"
          placeholder="서로를 배려하는 마음을 담아 작성해 주세요"
          type="text"
          autoComplete="off"
          name="reviewContent"
          value={reviewContent}
          onChange={({ target: { value } }) => setReviewContent(value)}
        />
        <div className="flex justify-between bg-transparent">
          <input
            placeholder="사용자 ID를 입력하세요."
            className="p-2 focus:outline-none "
            type="text"
            name="UserID"
            autoComplete="off"
            value={userID}
            onChange={({ target: { value } }) => setUserID(value)}
          />
          <button className="bg-blue-700 text-neutral-50 p-2" onClick={OnClick}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
