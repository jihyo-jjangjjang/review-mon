import { useParams } from "react-router-dom";
import Header from "../components/Header";

const PlacePage = () => {
  const { place } = useParams();
  return (
    <div>
      <Header back={true} />
      <h1>Place Page for {place}</h1>
    </div>
  );
};

export default PlacePage;
