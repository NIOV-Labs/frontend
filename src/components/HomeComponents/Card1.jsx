import { Link } from 'react-router-dom'

const Card1 = ({ title, description, button1, button2, image, gradient, direction }) => {
  return (
    <div className={`${direction} w-full max-w-6xl p-5 flex flex-col justify-center items-center gap-4 lg:gap-6 xl:gap-16`}>
        <div className={`border max-w-lg border-gray-200 w-full grid place-content-center p-2 rounded bg-gradient-to-tr ${gradient}`}>
            <img src={image} alt="image" className='object-contain h-44 sm:h-52 md:h-56 lg:h-64 2xl:h-72' />
        </div>
        <div className='flex flex-col justify-start items-start gap-4'>
            <div className="w-full flex flex-col justify-start items-start gap-2">
                <h1 className="text-2xl lg:text-3xl xl:text-5xl font-semibold max-w-xl">{title}</h1>
                <p className="text-xs lg:text-sm xl:text-md text-zinc-600 max-w-xl">
                    {description}
                </p>
            </div>
            <div className="flex w-full justify-start items-start gap-2">
                {button1 && 
                    <Link to={'/home'} className="rounded-full border border-gray-300 py-2 px-3 text-xs">
                    {button1}
                    </Link>     
                }
                {button2 && 
                    <Link to={'/home'} className="rounded-full text-white bg-black py-2 px-3 text-xs">
                    {button2}
                    </Link>  
                }
            </div>
        </div>
    </div>
  )
}

export default Card1