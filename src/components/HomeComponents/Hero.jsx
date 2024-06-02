import { Link } from "react-router-dom"
import Header from '../../assets/Header.svg'
import { Button } from "react-bootstrap"

const Hero = ({ web3Handler, hasWeb3}) => {
  return (
    <div className="w-full flex justify-center bg-gradient-to-tr from-white via-[#D7E7F4] to-white relative pt-[4.5rem] md:pt-24">
      <div className="relative overflow-hidden w-full max-w-7xl flex flex-col justify-center items-start gap-4 px-5 md:px-10 py-10 sm:py-16 md:py-20 lg:py-32 2xl:py-40">
          <div className="w-full flex flex-col justify-start items-start gap-2 relative z-20">
              <p className="text-sm lg:text-md xl:text-lg text-zinc-600 font-medium tracking-wide">Asset Bound Tokens (ABTs)</p>
              <h1 className="text-3xl md:text-7xl lg:text-6xl xl:text-7xl font-bold max-w-xl lg:max-w-3xl ">The Future of Assets Management</h1>
              <p className="text-sm md:text-[15px] lg:text-md xl:text-lg text-zinc-600 max-w-xl font-medium tracking-normal">
                  Revolutionize asset management with Federation Cloud and Asset Bound Tokens. Where your tokenized assets are personalized, dynamic, and ever-evolving. Step
                  into the future and shape your digital destiny with us.
              </p>
          </div>
          <div className="flex justify-start items-center gap-2 md:gap-3">
            {/* <Link to={'/home'} className="rounded-full text-white bg-black py-2 px-3 text-sm"> */}
            {/* <Link to={'/'} className="rounded-full text-white bg-primary1 py-3 px-4 text-sm md:text-base font-semibold md:py-4 md:px-6">
              Get started
            </Link> */}
            {
              !hasWeb3 ? (
                <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded text-white bg-primary1 py-2 px-3 text-sm md:text-base font-semibold md:py-4 md:px-5">
                  Download Metamask
                </a>              
              ) : (
                // <Button onClick={web3Handler} className='bg-primary1 text-white py-1 px-3 md:py-3 md:px-6 rounded text-base xl:text-lg font-medium'>Connect Wallet</Button>
                <Button onClick={web3Handler} className='rounded text-white bg-primary1 py-2 px-3 text-sm md:text-base font-semibold md:py-3 md:px-5'>Connect Wallet</Button>
              )
          }
            <Link to={'/'} className="rounded border-primary1 border-2 text-primary1 py-2 px-3 text-sm md:text-base font-semibold md:py-3 md:px-5">
              Learn More
            </Link>
          </div>
          <div className="absolute z-5 right-0 top-[-2] hidden md:flex">
            <img src={Header} alt="" />
          </div>
      </div>
    </div>
  )
}

export default Hero 