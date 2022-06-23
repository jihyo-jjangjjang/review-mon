import {Link, useParams} from "react-router-dom";
import Header from "../components/Header";
import {useEffect, useState} from "react";
import {API_URL} from "../constants";
import {UserCircleIcon} from "@heroicons/react/solid";
import Rating from "../components/Rating";
import {getRingByCredibility} from "../utils";

const UserPage = () => {
    const {user} = useParams()
    const [reviewList, setReviewList] = useState([])

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/review/user/${user}`)
            const reviews = await response.json()
            setReviewList(reviews)
            console.log(reviews)
        })()
    }, [])

    return <div>
        <Header back={true} />
        <h1 className="font-bold text-2xl text-gray-900">{user}님의 리뷰</h1>
        <div className="my-6 text-lg font-semibold">
            <span className="">전체</span>
            <span className="ml-2 text-indigo-800">{reviewList.length}</span>
        </div>
        <div className="my-6 divide-y-2 border-gray-200 border-y-2">
            {reviewList.map(({user, place, comment, rating, credibility, created_at}, idx) => <div key={idx} className="w-full p-2 flex">
                <div className="w-10 my-auto">
                    <UserCircleIcon className={`w-10 h-10 text-gray-400 bg-transparent ring-4 ${getRingByCredibility(credibility)} rounded-full`} />
                </div>
                <div className="ml-4 flex flex-col gap-1">
                    <Rating rating={rating} />
                    <span className="text-md">{comment}</span>
                    <div>
                        <Link to={`/place/${place}`} className="text-sm text-gray-400 hover:underline hover:text-gray-900">{place}</Link>
                        <span className="text-sm text-gray-400"> | {new Date(created_at).toLocaleTimeString()} | 신고</span>
                    </div>
                </div>
            </div>)}
        </div>
    </div>
}

export default UserPage