import { useParams } from "react-router-dom";
import React, { useState, ReactElement, useEffect } from "react";
import Rating from "../components/Rating";

const PlacePage = () => {
  const { place } = useParams();
  const [userRating, setter] = useState(1);
  return (
    <div>
      <Rating setter={setter} userRating={userRating}></Rating>
      <h1>Place Page for {place}</h1>
      {Rate()}
      {ReviewContent()}
      {UserID()}
      {ReviewButton()}
    </div>
  );
};

const Rate = () => {};

const ReviewContent = () => {
  const [reviewContent, setReviewContent] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleChange = ({ target: { value } }) => setReviewContent(value);

  const handleSubmit = async (event) => {
    setDisabled(true);
    event.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    setDisabled(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="서로를 배려하는 마음을 담아 작성해 주세요"
        type="text"
        name="reviewContent"
        value={reviewContent}
        onChange={handleChange}
      />
    </form>
  );
};

const UserID = () => {
  const [userID, setUserID] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleChange = ({ target: { value } }) => setUserID(value);

  const handleSubmit = async (event) => {
    setDisabled(true);
    event.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    setDisabled(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="사용자 ID를 입력하세요."
        type="text"
        name="UserID"
        value={userID}
        onChange={handleChange}
      />
    </form>
  );
};

const ReviewButton = (disabled) => {
  return <button disabled={disabled}>등록</button>;
};
export default PlacePage;
