import {useParams} from "react-router-dom";

const UserPage = () => {
    const {user} = useParams()

    return <div>
        <h1>User Page for {user}</h1>
    </div>
}

export default UserPage