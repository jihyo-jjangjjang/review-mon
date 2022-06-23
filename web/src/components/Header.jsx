import { ChevronLeftIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const navigate = useNavigate();
  const showBackButton = props.back;
  return (
    <div className="w-full mb-10 flex justify-between">
      <ChevronLeftIcon
        visibility={showBackButton ? "visible" : "hidden"}
        onClick={() => {
          navigate(-1);
        }}
        className="w-6 h-6 text-gray-600 hover:text-gray-900"
      />
      <span className="font-bold text-indigo-800 text-2xl">리뷰몬</span>
      <span className="w-6 h-6"></span>
    </div>
  );
};

export default Header;
