import Security from '../../assets/Security.svg'
import Management from '../../assets/Management.svg'
import Interoperability from '../../assets/Interoperability.svg'
import Compliance from '../../assets/Compliance.svg'
import Customizable from '../../assets/Customizable.svg'
import Insights from '../../assets/Insights.svg'
import { motion } from "framer-motion";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useMeasure from "react-use-measure";

const CARD_WIDTH = 310;
const CARD_HEIGHT = 470;
const MARGIN = 20;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

const CardCarousel = () => {
    const [{ width }] = useMeasure();
    const [offset, setOffset] = useState(0);
  
    const CARD_BUFFER =
      width > BREAKPOINTS.lg ? 3 : width > BREAKPOINTS.sm ? 2 : 1;
  
    const CAN_SHIFT_LEFT = offset < 0;
  
    const CAN_SHIFT_RIGHT =
      Math.abs(offset) < CARD_SIZE * (items.length - CARD_BUFFER);
  
    const shiftLeft = () => {
      if (!CAN_SHIFT_LEFT) {
        return;
      }
      setOffset((pv) => (pv += CARD_SIZE));
    };
  
    const shiftRight = () => {
      if (!CAN_SHIFT_RIGHT) {
        return;
      }
      setOffset((pv) => (pv -= CARD_SIZE));
    };
  return (
    <div className='bg-slate-100 w-full px-5 py-10 md:py-12 lg:py-14 2xl:py-16'>
        <div className="relative overflow-hidden min-[2000px]:hidden">
            <div className='w-full flex justify-center mb-5 lg:mb-6 2xl:mb-7'>
                <div className='flex items-center justify-start w-full'>
                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold max-w-sm lg:max-w-md">Benefits of Creating and Utilizing ABTs</h1>
                </div>
            </div>
            <div className="mx-auto max-w-6xl">
                <motion.div
                    animate={{
                    x: offset,
                    }}
                    className="flex"
                >
                    {items.map((item, index) => {
                    return <Card key={index} {...item} />;
                    })}
                </motion.div>
            </div>
            <>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_LEFT ? "0%" : "-100%",
            }}
            className="absolute left-0 top-[60%] z-30 rounded-r-xl bg-slate-100/30 p-3 pl-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pl-3"
            onClick={shiftLeft}
          >
            <FiChevronLeft />
          </motion.button>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_RIGHT ? "0%" : "100%",
            }}
            className="absolute right-0 top-[60%] z-30 rounded-l-xl bg-slate-100/30 p-3 pr-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pr-3"
            onClick={shiftRight}
          >
            <FiChevronRight />
          </motion.button>
        </>
        </div>
        <div className='hidden min-[2000px]:flex min-[2000px]:flex-col min-[2000px]:justify-center min-[2000px]:items-start w-full '>
            <div className='w-full flex justify-center mb-5 lg:mb-6 2xl:mb-7'>
                <div className='flex items-center justify-start w-full max-w-[124rem]'>
                    <h1 className="text-2xl lg:text-3xl xl:text-5xl font-semibold max-w-lg">Benefits of Creating and Utilizing ABTs</h1>
                </div>
            </div>
            <div className='min-[2000px]:flex min-[2000px]:justify-center min-[2000px]:items-center w-full '>
                {items.map((item, index) => {
                    return <Card key={index} {...item} />;
                })}
            </div>
        </div>
    </div>
  )
}


const Card = ({ title, description, image }) => {
    return (
        <div 
            className="relative shrink-0 cursor-pointer rounded-lg bg-white shadow-md"
            style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                marginRight: MARGIN,
              }}
        >
            <div className="absolute border-gray-200 border flex flex-col justify-between items-start inset-0 z-20 rounded-lg bg-gradient-to-br from-[#F9F7FE] to-[#ECE7FE] p-6 text-white">
                <p className="my-2 min-[2000px]:my-0 text-xl font-bold text-black">{title}</p>
                <div className='flex flex-col justify-center items-center'>
                    <img src={image} alt="" />
                    <p className="text-sm text-gray-800">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default CardCarousel

const items = [
    {
        title: 'Enhanced Security',
        description: 'Secure your digital assets like never before with ABTs. Leveraging cutting edge blickchain technology, ABTs offer tamper-proof security ensuring your assets are safeguarded against unauthorized access and fraud.',
        image: Security
    },
    {
        title: 'Real-Time Asset Management',
        description: 'Streamline your operations with ABTs that enable real-time management and tracking of digital assets. Make informed decisions quickly as you monitor asset performanc and utilization in a dynamic, ever changing market.',
        image: Management
    },
    {
        title: 'Increased Interoperability',
        description: 'Experience unmatched flexibility with ABTs designed for seamless interoperability across various blockchain platforms. Expand your asset`s reach and utility without the constraints of single network limitations.',
        image: Interoperability
    },
    {
        title: 'Customizable Asset Features',
        description: 'Tailor your assets to meet specific needs with ABTs` customized features. From aesthetics to utility, personalize every aspect of your digital asset, enhancing its appeal and relevance to your target audience.' ,
        image: Compliance
    },
    {
        title: 'Data-Driven Insights',
        description: 'Gain valuable insights with ABTs that collect and analyze data across their lifecycle. Utilize these analytics to optimize asset performanc, forecast trends, and make strategic decisisons to drive growth and profitability.',
        image: Customizable
    }, 
    {
        title: 'Robust Compliance',
        description: 'Ensure your djigital assets comply with evolving regulatory standards with aBTs powered by Federation Cloud (FDC). Benefit from built-in compliance features that adapt to legal changes, providing a secure environment.',
        image: Insights
    }
    
]