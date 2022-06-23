import { StarIcon as SolidStarIcon } from "@heroicons/react/solid";
import { StarIcon as OutlineStarIcon } from "@heroicons/react/outline";
import { useState } from "react";

const Rating = ({ rating, setter, userRating }) => {
  const isReadOnly = rating !== undefined;
  if (isReadOnly) {
    return (
      <div className="text-amber-400 flex">
        {Array.from(Array(rating)).map((_, idx) => (
          <div>
            <SolidStarIcon key={idx} className="w-5 h-5" />
          </div>
        ))}
        {rating < 5 &&
          Array.from(Array(5 - rating)).map((_, idx) => (
            <div>
              <OutlineStarIcon key={idx} className="w-5 h-5" />
            </div>
          ))}
      </div>
    );
  } else {
    return (
      <div className="text-amber-400 flex">
        {Array.from(Array(userRating)).map((_, idx) => (
          <div>
            <SolidStarIcon
              key={idx}
              className="w-5 h-5"
              onClick={() => {
                setter(idx + 1);
              }}
            />
          </div>
        ))}
        {userRating < 5 &&
          Array.from(Array(5 - userRating)).map((_, idx) => (
            <div>
              <OutlineStarIcon
                key={idx + userRating}
                className="w-5 h-5"
                onClick={() => {
                  setter(idx + userRating + 1);
                }}
              />
            </div>
          ))}
      </div>
    );
  }
};

export default Rating;
