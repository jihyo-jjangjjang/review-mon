import {StarIcon as SolidStarIcon} from "@heroicons/react/solid";
import {StarIcon as OutlineStarIcon} from '@heroicons/react/outline'

const Rating = ({rating}) => {
    return <div className="text-amber-400 flex">
        {Array.from(Array(rating)).map((_, idx) => <div>
            <SolidStarIcon key={idx} className="w-5 h-5" />
        </div>)}
        {rating < 5 && Array.from(Array(5 - rating)).map((_, idx) => <div>
            <OutlineStarIcon key={idx} className="w-5 h-5" />
        </div>)}
    </div>
}

export default Rating