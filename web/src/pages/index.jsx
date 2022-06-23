import Header from "../components/Header";
import Search from "../components/search";

const IndexPage = () => {
  return (
    <div className="w-full gap-10">
      <Header back={false} />
      <Search />
      <div class="box-content h-30 w-30 p-5 "></div>
      <div className="font-bold text-50 text-gray-900  text-center "> 
        <div className=" underline decoration-solid">주변 인기 맛집 찾기👀</div>
      </div>

      <div className="w-50 h-50 mx-auto op ">
        <img className="p-5 opacity-50" alt ="picture" src="mapo.png" >
        </img>
        <a className ="font-bold text-center" href='https://www.google.com/maps/search/%EC%8B%A0%EC%B4%8C+%EB%A7%9B%EC%A7%91/data=!3m1!4b1'> 신촌 맛집🍜</a>
        <img className="p-5 opacity-50" alt ="picture" src="daepo.png" />
        <a className ="font-bold text-center" href='https://www.google.com/maps/search/%ED%99%8D%EB%8C%80%EB%A7%9B%EC%A7%91/data=!3m1!4b1'> 홍대 맛집🍜</a>
      </div>


    
      
    </div>
  );
};

export default IndexPage;
