import { Link } from "react-router-dom";

const List = (props) => {
  const searchList = props.param;
  var list = [];
  var i = 0;
  while (i < searchList.length) {
    list.push(
      <Link key={i} to={"place/" + searchList[i]} className="block border-b-2 p-4 font-medium text-lg text-gray-400 hover:text-gray-900">
          {searchList[i]}
      </Link>
    );
    i++;
  }
  return (
    <div>
      <div>{list}</div>
    </div>
  );
};

export default List;
