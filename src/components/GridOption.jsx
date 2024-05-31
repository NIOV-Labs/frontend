import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";

const GridOption = ({grid, setGrid}) => {
  return (
    <>
        <MobileVersion grid={grid} setGrid={setGrid} />
        <DesktopVersion grid={grid} setGrid={setGrid} />
    </>
  )
}

export default GridOption

const MobileVersion = ({grid, setGrid}) => {
    return (
        <div onClick={() => setGrid(!grid)} className={`lg:hidden grid text-xs lg:text-base place-content-center cursor-pointer rounded-sm bg-white p-2 border-[1px] border-slate-200`}>
            {grid ? (
                <BsFillGrid3X3GapFill />
            ) : (
                <FaList />
            )}
        </div>
    )
}

const DesktopVersion = ({ grid, setGrid }) => {
    return (
      <div className="hidden lg:flex gap-0">
        <div 
          onClick={() => setGrid(true)} 
          className={`cursor-pointer rounded-sm p-2 border-[1px] border-slate-200 ${grid ? 'bg-gray-300' : 'bg-white'}`}>
          <BsFillGrid3X3GapFill />
        </div>
        <div 
          onClick={() => setGrid(false)} 
          className={`cursor-pointer rounded-sm p-2 border-[1px] border-slate-200 ${!grid ? 'bg-gray-300' : 'bg-white'}`}>
          <FaList />
        </div>
      </div>
    );
  };