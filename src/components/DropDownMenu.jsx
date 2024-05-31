import { useState } from "react"

const DropDownMenu = ({Icon, flexDirection, positioning, title, menuOptions, option, updateFilter}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOption = (index) => {
    setIsOpen(false);
    updateFilter(index)
  };
  return (
    <div className={`relative flex ${flexDirection} justify-center items-center cursor-pointer rounded-sm bg-white px-2 py-1 border-[1px] border-slate-200`}>
        <div className={`flex justify-center items-center gap-2 ${flexDirection}`} onClick={() => setIsOpen(!isOpen)}>
            <p className="text-sm lg:text-base">{title}</p>
            <div className='text-sm lg:text-base'>
                <Icon />
            </div>
        </div>
        {
            isOpen && 
                <div className={`absolute top-8 ${positioning} w-32 shadow-2xl flex flex-col justify-center items-start gap-1 bg-white border-neutral-600 z-20 rounded-sm p-3`}>
                    {menuOptions.map((label, index) => {
                        return (
                            <ul key={index} onClick={() => handleOption(index)} className={`w-full cursor-pointer font-medium ${option === index ? 'text-primary1' : 'text-stone-400'}`}>{label}</ul>
                        )
                    })}
                </div> 
        }
    </div>
  )
}

export default DropDownMenu