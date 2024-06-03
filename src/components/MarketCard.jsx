import { IoShieldCheckmark } from "react-icons/io5";
import { Link } from 'react-router-dom';

const MarketCard = ({abt}) => {
  const imageUrl = abt.images && abt.images.length > 0 ? abt.images[0] : abt.document1image;
//   console.log(imageUrl)

  return (
    <Link to={`/abt/${abt.tokenId}`} className="bg-white border-[1px] overflow-hidden cursor-pointer border-gray-200 rounded shadow  flex flex-col justify-between items-center">
        <div className="h-80 overflow-hidden flex items-center justify-center">
            <img className="object-contain" src={imageUrl} alt="abt image"/>
        </div>
        <div className='w-full flex justify-between items-center p-2 border-t-[1px] border-gray-200'>
            <div className="flex flex-col justify-center items-start ">
                <div className='flex justify-start gap-1 items-center'>
                    <p className='text-sm lg:text-md text-stone-500'>{'...' + abt.owner.slice(38, 42)}</p>
                    <div>
                        <IoShieldCheckmark />
                    </div>
                </div>
                <h1 className="text-lg lg:text-xl">{abt.name}</h1>
            </div>
            {abt.priceUsd > 0 && 
                <div className="flex flex-col justify-center items-start ">
                    <div className='flex justify-start gap-1 items-center'>
                        <p className='text-sm lg:text-md text-stone-500'>Price</p>
                    </div>
                    <h1 className="text-lg lg:text-xl">$ {abt.priceUsd.toLocaleString()}</h1>
                </div>
            }
        </div>
    </Link>
  )
}

export default MarketCard