import { Link } from 'react-router-dom'
import logo from '../../assets/Logo.png'
import { Button } from 'react-bootstrap'
import { useState } from 'react'
import { useMotionValueEvent, useScroll, motion } from 'framer-motion'

const HomeNavBar = ({ web3Handler, hasWeb3}) => {
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
                setHidden(true)
        } else {
                setHidden(false)
        }
  });

  return (
    <motion.nav 
      className='w-full z-50 fixed top-0 mx-auto flex justify-center items-center bg-white h-[4.5rem] md:h-24 border-b-[1px] border-stone-300'
      variants={{
        visible: {y: 0},
        hidden: {y: "-100%"}
      }}
      animate={hidden ? 'hidden' : 'visible'} transition={{duration: .4, ease: "easeInOut"}}
    >
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
                <Button onClick={web3Handler} className="btn btn-primary rounded text-white bg-primary1 py-3 px-4 text-sm md:text-base font-semibold md:py-4 md:px-6">Connect Wallet</Button>
              )
          }
        </div>
      </div>
    </motion.nav>
  )
}

export default HomeNavBar
