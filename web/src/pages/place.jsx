import {useParams} from "react-router-dom";

const PlacePage = () => {
    const {place} = useParams()
    return <div>
        <h1>Place Page for {place}</h1>
    </div>
}

export default PlacePage