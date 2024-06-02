import { Link } from 'react-router-dom'

const Card1 = ({ title, description, button1, image, gradient, direction }) => {
  return (
    <div className={`${direction} w-full max-w-6xl p-5 md:px-10 flex flex-col justify-center items-center gap-4 lg:gap-6 xl:gap-16`}>
        <div className={`border max-w-lg border-gray-200 w-full grid place-content-center p-2 rounded bg-gradient-to-tr ${gradient}`}>
            <img src={image} alt="image" className='object-contain h-44 sm:h-52 md:h-56 lg:h-64 2xl:h-72' />
        </div>
        <div className='flex flex-col justify-start items-start gap-4'>
            <div className="w-full flex flex-col justify-start items-start gap-2">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold max-w-xl">{title}</h1>
                <p className="text-sm lg:text-base  text-zinc-600 max-w-xl tracking-wide">
                    {description}
                </p>
            </div>
            <div className="flex w-full justify-start items-start gap-2">
                {button1 && 
                    <Link to={'/'} className="rounded border-2 border-primary1 text-primary1 py-1 px-2 text-sm md:text-base font-semibold md:py-2 md:px-4 ">
                        {button1}
                    </Link>    
                }
                {/* {button2 && 
                    <Link to={'/home'} className="rounded-full text-white bg-black py-2 px-3 text-xs">
                    {button2}
                    </Link>  
                } */}
            </div>
        </div>
    </div>
  )
}

export default Card1