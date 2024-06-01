import { Link } from "react-router-dom"
import Header from '../../assets/Header.svg'

const Hero = () => {
  return (
    <div className="w-full flex justify-center bg-gradient-to-tr from-white via-[#D7E7F4] to-white">
      <div className="relative overflow-hidden w-full max-w-7xl flex flex-col justify-center items-start gap-4 px-5 py-10 sm:py-16 md:py-20 lg:py-32 2xl:py-40">
          <div className="w-full flex flex-col justify-start items-start gap-2">
              <p className="text-sm lg:text-md xl:text-lg text-zinc-600">Asset Bound Tokens (ABTs)</p>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold max-w-xl">The Future of Assets Management</h1>
              <p className="text-xs lg:text-sm xl:text-md text-zinc-600 max-w-xl">
                  Revolutionize asset management with Federation Cloud and Asset Bound Tokens. Where your tokenized assets are personalized, dynamic, and ever-evolving. Step
                  into the future and shape your digital destiny with us.
              </p>
          </div>
          <div className="flex justify-start items-center gap-2">
            <Link to={'/home'} className="rounded-full text-white bg-black py-2 px-3 text-sm">
              Get started
            </Link>
            <Link to={'/home'} className="rounded-full border border-gray-300 py-2 px-3 text-sm">
              Contact sales
            </Link>
          </div>
          <div className="absolute right-0 top-[-2] hidden md:flex">
            <img src={Header} alt="" />
          </div>
      </div>
    </div>
  )
}

export default Hero 