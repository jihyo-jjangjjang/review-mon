import {useParams} from "react-router-dom";
import Header from "../components/Header";
import {useCallback, useEffect} from "react";
import {API_URL} from "../constants";

const UserPage = () => {
    const {user} = useParams()

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/review/user/${user}`)
            console.log(response.json())
        })()
    }, [])

    return <div>
        <Header />
        <h1 className="font-bold text-2xl text-gray-900">{user}님의 리뷰</h1>
    </div>
}

export default UserPage