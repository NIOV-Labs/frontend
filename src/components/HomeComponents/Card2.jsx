import { Link } from 'react-router-dom'
import Footer from '../../assets/Footer.svg'

const Card2 = () => {
  return (
    <div className={`w-full px-5 md:px-10 py-10 lg:py-5 flex justify-center items-center`}>
       <div className='border-gray-200 border w-full max-w-6xl rounded p-5 md:p-16 lg:p-20 overflow-hidden flex flex-col justify-center items-start gap-4 relative bg-gradient-to-r from-[#FDB3CB] via-white to-[#C6B5FC]'>
            <h1 className="text-2xl lg:text-3xl xl:text-5xl font-semibold max-w-[26rem] xl:max-w-[38rem] relative z-10">The future of creating and managing Real World Assets (RWAs) in the blockchain industry.</h1>
            <div className="flex justify-start items-center gap-2 relative z-10">
                {/* <Link to={'/home'} className="rounded-full text-white bg-black py-2 px-3 text-sm">
                    Learn More
                </Link> */}
                <Link to={'/'} className="rounded border-2 border-primary1 text-primary1 py-2 px-3 text-sm md:text-base font-semibold md:py-3 md:px-5 ">
                    Learn more
                </Link>
          </div>
          <div className="absolute right-[-12rem] top-[-2] hidden md:flex">
            <img src={Footer} alt="" />
          </div>
        </div>
    </div>
  )
}

export default Card2