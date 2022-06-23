import Header from "../components/Header";
import Search from "../components/search";

const IndexPage = () => {
  return (
    <div className="w-full">
      <Header back={false} />
      <Search />
    </div>
  );
};

export default IndexPage;
