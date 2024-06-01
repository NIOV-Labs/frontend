import logo from '../../assets/Logo.png'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='w-full flex justify-center items-center border-t border-gray-300 px-5 py-6 md:px-10'>
        <div className='w-full max-w-7xl flex justify-between items-center'>
            <div className='w-max flex justify-center items-center'>
                <div className='flex items-center justify-center border-r pr-3 lg:pr-4 border-gray-300'>
                    <Link to="/">
                        <img src={logo} alt="Logo" className="w-[5.5rem] sm:w-28" />
                    </Link>
                </div>
                <div className='pl-3 lg:pl-4'>
                    <p className='text-xs lg:text-sm'>2024 NIOVLABS INC</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer