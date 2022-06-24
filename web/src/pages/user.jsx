import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../constants';
import {
  UserCircleIcon,
  ChatAltIcon,
  EmojiHappyIcon,
  EmojiSadIcon,
  FastForwardIcon,
  QuestionMarkCircleIcon,
  HandIcon,
} from '@heroicons/react/solid';
import Rating from '../components/Rating';
import { getRingByCredibility } from '../utils';
import ReactLoading from 'react-loading';

const UserPage = () => {
  const { user } = useParams();
  const [reviewList, setReviewList] = useState([]);
  const [tag, setTag] = useState();

  useEffect(() => {
    (async () => {
      // load reviews
      let response = await fetch(`${API_URL}/review/user/${user}`);
      const reviews = await response.json();
      setReviewList(reviews);
      // load tag
      response = await fetch(`${API_URL}/tag/user/${user}`);
      const tag = await response.json();
      setTag(tag);
    })();
  }, []);

  return (
    <div>
      <Header back={true} />
      <h1 className='font-bold text-2xl text-gray-900'>{user}님의 리뷰</h1>
      <div className='h-12'>
        {!tag && (
          <div className='w-full h-full flex flex-col items-center justify-center'>
            <ReactLoading type='bubbles' color='#3730a3' />
            <span className='font-medium text-gray-600'>태그 분석 중</span>
          </div>
        )}
        {tag && (
          <span className='font-semibold text-2xl text-indigo-800'>#{tag}</span>
        )}
      </div>
      <div className='mt-4 text-xl font-semibold'>
        <span className=''>전체</span>
        <span className='ml-2 text-indigo-800'>{reviewList.length}</span>
      </div>
      <div className='mt-2 divide-y-2 border-gray-200 border-y-2'>
        {reviewList.map(
          (
            { user, place, comment, rating, credibility, created_at, tag },
            idx
          ) => (
            <div key={idx} className='w-full p-2 flex'>
              <div className='w-10 mt-2'>
                {tag === '응애' && (
                  <HandIcon
                    className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                      credibility
                    )} rounded-full`}
                  />
                )}
                {tag === '언어의 마술사' && (
                  <QuestionMarkCircleIcon
                    className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                      credibility
                    )} rounded-full`}
                  />
                )}
                {tag === '긴 말은 안한다' && (
                  <FastForwardIcon
                    className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                      credibility
                    )} rounded-full`}
                  />
                )}
                {tag === '모든 램지' && (
                  <EmojiSadIcon
                    className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                      credibility
                    )} rounded-full`}
                  />
                )}
                {tag === '박찬호' && (
                  <ChatAltIcon
                    className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                      credibility
                    )} rounded-full`}
                  />
                )}
                {tag === '아낌없이 주는 사람' && (
                  <EmojiHappyIcon
                    className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(
                      credibility
                    )} rounded-full`}
                  />
                )}
              </div>
              <div className='ml-4 flex flex-col gap-1'>
                <Rating rating={rating} />
                <span className='text-md'>{comment}</span>
                <div>
                  <Link
                    to={`/place/${place}`}
                    className='text-sm text-gray-400 hover:underline hover:text-gray-900'
                  >
                    {place}
                  </Link>
                  <span className='text-sm text-gray-400'>
                    {' '}
                    | {new Date(created_at).toLocaleDateString()} | 신고
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserPage;
