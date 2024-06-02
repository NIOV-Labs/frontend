import { Link } from 'react-router-dom'
import logo from '../../assets/Logo.png'
import { Button } from 'react-bootstrap'

const HomeNavBar = ({ web3Handler, hasWeb3}) => {

  return (
    <nav className='w-full z-50 fixed top-0 mx-auto flex justify-center items-center bg-white h-[4.5rem] md:h-24 border-b-[1px] border-stone-300'>
      <div
        className="flex items-center justify-between w-full px-5 py-6 md:px-10 max-w-7xl"
      >
        <div className='flex items-center justify-center'>
          <Link to="/">
            <img src={logo} alt="Logo" className="w-[7rem] sm:w-32 md:w-40 object-contain" />
          </Link>
        </div>
        <div className='flex gap-5 text-[#000]'>
          {
           !hasWeb3 ? (
                <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded text-white bg-primary1 py-3 px-4 text-sm md:text-base font-semibold md:py-4 md:px-6">
                  Download Metamask
                </a> 
              ) : (
                // <Button onClick={web3Handler} className='bg-primary1 text-white py-1 px-3 md:py-3 md:px-6 rounded text-base xl:text-lg font-medium'>Connect Wallet</Button>
                <Button onClick={web3Handler} className="btn btn-primary rounded text-white bg-primary1 py-3 px-4 text-sm md:text-base font-semibold md:py-4 md:px-6">Connect Wallet</Button>
              )
          }
        </div>
      </div>
    </nav>
  )
}

export default HomeNavBar
