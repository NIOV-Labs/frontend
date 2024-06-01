import { motion } from "framer-motion";

const ActiveSection = ({ headers, active, setActive}) => {
  return (
    <div className='flex justify-center items-center w-max'>
        {headers.map((title, index) => {
            return (
                <Tab
                    key={index}
                    setSelected={setActive}
                    selected={active === index}
                    title={title}
                    tabNum={index}
                />
            )
        })}
    </div>
  )
}

export default ActiveSection

const Tab = ({ selected, setSelected, title, tabNum}) => {
    return (
        <div className='relative w-full'>
            <button
                onClick={() => setSelected(tabNum)}
                className="relative z-0 flex w-full items-center justify-center border-b-4 border-slate-200 bg-white p-1  transition-colors hover:bg-slate-100 md:flex-col"
            >
                <span
                    className={`w-[70px] lg:w-[75px] text-center text-xs lg:text-sm text-slate-600 transition-opacity md:text-center ${
                        selected ? "opacity-100" : "opacity-50"
                    }`}
                >
                    {title}
                </span>
            </button>
            {selected && (
            <motion.span
            layoutId="tabs-features-underline"
            className="absolute bottom-0 left-0 right-0 z-10 h-1 bg-primary1"
            />
        )}
        </div>
    )
}