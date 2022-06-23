import { Link } from "react-router-dom";

const List = (props) => {
  const searchList = props.param;
  var list = [];
  var i = 0;
  while (i < searchList.length) {
    list.push(
      <div className="border-b-2 p-4 text-gray-400 hover:text-gray-900" key={i}>
        <Link
          to={"place/" + searchList[i]}
          key={i}
          className="text-zinc-600 text-lg"
        >
          {searchList[i]}
        </Link>
      </div>
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
