import { useEffect, useState } from "react";
import DropDownMenu from "../components/DropDownMenu";
import PageHeader from "../components/PageHeader";
import { FiChevronDown } from "react-icons/fi";
import { MdArrowForwardIos, MdFilterList } from "react-icons/md";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { parseEther } from "ethers";
import ProceedsModal from "../components/ProceedsModal";
import { getSoldABTs, getGrossRevenue, exportMarketplaceData } from "../utilities/Contract";

const Dashboard = ({ client, market, abt }) => {
  const [revenueTime, setRevenueTime] = useState('Yearly');
  const revenueTimeFrames = ['Yearly', 'Monthly', 'Weekly', 'Daily'];
  const [userProceeds, setUserProceeds] = useState({});
  const [soldABTs, setSoldABTs] = useState(0);
  const [grossRevenue, setGrossRevenue] = useState(0);
  const [openProceeds, setOpenProceeds] = useState(false);
  const [loadingProceeds, setLoadingProceeds] = useState(false);

  const loadDashboardItems = async () => {
    try {
      const proceeds = await market.checkProceeds(client.account);
      console.log('Proceeds:', proceeds);
      setUserProceeds({
        rawValue: parseInt(proceeds.rawValue) / (10 ** 18),
        usdPennyValue: (parseInt(proceeds.usdPennyValue.toString()) / 100).toFixed(2)
      });
  
      const soldResponse = await getSoldABTs(client.account);
      setSoldABTs(soldResponse.soldABTs);
  
      const revenueResponse = await getGrossRevenue(client.account);
      setGrossRevenue(revenueResponse.grossRevenue / 100); // Assuming the revenue is in pennies
    } catch (error) {
      console.error('Error loading dashboard items:', error);
    }
  };
  

  const handleClaimingProceeds = async () => {
    try {
      console.log(market);
      setLoadingProceeds(true);
      console.log(client);
      const tx = await market.withdrawProceeds();
      await tx.wait();
      setLoadingProceeds(false);
      console.log('Proceeds withdrawn successfully');
      loadDashboardItems();
    } catch (error) {
      console.error('Error withdrawing proceeds:', error);
    }
  };

  const handleExportData = async () => {
    try {
      await exportMarketplaceData(client.account);
      console.log('Marketplace data exported successfully');
    } catch (error) {
      console.error('Error exporting marketplace data:', error);
    }
  };

  useEffect(() => {
    loadDashboardItems();
  }, []);

  return (
    <>
      <PageHeader title={'Dashboard'} />
      <div className="w-full p-5 lg:p-10 grid grid-cols-1 min-[370px]:grid-cols-2 md:grid-cols-6 min-[1500px]:grid-cols-10 gap-4">
        <ABTContainer title={'Unclaimed Proceeds'} value={`$${userProceeds.usdPennyValue}`} setOpenProceeds={setOpenProceeds} badgeValue={`${userProceeds.rawValue} Ξ`} />
        <ABTContainer title={'Total ABT sold'} value={soldABTs} badgeValue={soldABTs} />
        <ABTContainer title={'Gross Revenue'} value={`$${grossRevenue}`} badgeValue={'+45%'} revenueTime={revenueTime} setRevenueTime={setRevenueTime} revenueTimeFrames={revenueTimeFrames} handleExportData={handleExportData}/>
        <GraphContainer title={`Active Listing's`} />
        <GraphContainer title={`Newly Created ABT's`} />
        <GraphContainer title={`Pending Offers`} />
        {openProceeds && <ProceedsModal isOpen={openProceeds} setIsOpen={setOpenProceeds} handleFunds={handleClaimingProceeds} loading={loadingProceeds} />}
        <DesktopGraphContainer />
      </div>
    </>
  );
};

export default Dashboard;

const ABTContainer = ({ title, value, badgeValue, revenueTime, setRevenueTime, revenueTimeFrames, setOpenProceeds, handleExportData }) => {
  const revenue = title === 'Gross Revenue';
  const proceeds = title === 'Unclaimed Proceeds';
  const handleClick = () => {
    if (proceeds) {
      setOpenProceeds(true);
    }
  };
  return (
    <div onClick={handleClick} className={`${proceeds ? 'cursor-pointer' : ''} w-full p-3 bg-[#F9FAFF] border-2 border-slate-300 flex flex-col justify-between items-start md:col-span-2 min-[1500px]:col-span-2 ${revenue ? 'col-span-1 min-[370px]:col-span-2' : 'col-span-1'}`}>
      <div className="flex justify-between items-center relative w-full">
        <p className="text-sm lg:text-base">{title}</p>
        {/* {revenue && <DropDownMenu Icon={FiChevronDown} flexDirection={''} title={revenueTime} options={revenueTimeFrames} setOptionState={setRevenueTime} />} */}
        {revenue && <button onClick={handleExportData}>Export</button>}
      </div>
      <h1 className="text-3xl lg:text-4xl my-4 font-semibold">{value}</h1>
      <div className={`flex justify-start items-center ${proceeds ? 'gap-0' : 'gap-2'}`}>
        <p className="text-sm lg:text-base">{revenue ? '24h Inflow' : proceeds ? '' : 'Layers'}</p>
        <div className={`${proceeds ? 'text-md lg:text-md' : 'text-xs lg:text-sm'}  ${revenue ? 'bg-green-400 text-black' : proceeds ? 'px-0 font-bold' : 'bg-slate-800 text-white'} px-2 py-[2px] rounded-full`}>
          {badgeValue}
        </div>
      </div>
    </div>
  );
};



const GraphContainer = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeListing = title === `Active Listing's`;
  const pending = title === `Pending Offers`;
  return (
    <div className={`w-full col-span-1 min-[370px]:col-span-2 ${activeListing ? 'md:col-span-6' : 'md:col-span-3 min-[1500px]:col-span-4'} ${!activeListing && 'min-[1500px]:hidden'}`}>
      <div className={`${isOpen ? '' : 'border-b-2 border-slate-300'} min-[1500px]:border-0  w-full flex justify-between items-center pb-4 min-[1500px]:pb-2`}>
        <div onClick={() => setIsOpen(!isOpen)} className="flex justify-start items-center gap-2">
          <p className="text-xl lg:text-2xl">{title}</p>
          <div className='text-xs lg:text-sm min-[1500px]:hidden'>
            <MdArrowForwardIos />
          </div>
        </div>
        {
          activeListing &&
          <div className="flex gap-2 md:gap-6 justify-end items-center">
            <DropDownMenu Icon={MdFilterList} flexDirection={'flex-row-reverse'} title={'Filter'} options={['Yearly', 'Monthly', 'Weekly', 'Daily']} />
            <DropDownMenu Icon={HiAdjustmentsHorizontal} flexDirection={'flex-row-reverse'} title={'Sort'} options={['Yearly', 'Monthly', 'Weekly', 'Daily']} />
          </div>
        }
        {
          pending &&
          <DropDownMenu Icon={MdFilterList} flexDirection={'flex-row-reverse'} title={'Filter'} options={['Yearly', 'Monthly', 'Weekly', 'Daily']} />
        }
      </div>
    </div>
  );
};

const DesktopGraphContainer = () => {
  return (
    <div className="w-full hidden min-[1500px]:flex flex-col col-span-4 row-start-1 row-span-2 col-start-7 justify-between items-start ">
      <div className="w-full flex flex-col jusitfy-start items-start">
        <div className={`w-full flex justify-between items-center pb-2 border-b-2 border-slate-300 min-[1500px]:border-0`}>
          <p className="text-xl lg:text-2xl">Newly Created ABT&apos;s</p>
        </div>
        {/* Graph content will go here */}
      </div>
      <div className="w-full flex flex-col jusitfy-start items-start">
        <div className={`w-full flex justify-between items-center pb-2 border-b-2 border-slate-300 min-[1500px]:border-0`}>
          <p className="text-xl lg:text-2xl">Pending Offers</p>
          <div className="flex gap-6 justify-end items-center">
            <DropDownMenu Icon={MdFilterList} flexDirection={'flex-row-reverse'} title={'Filter'} options={['Yearly', 'Monthly', 'Weekly', 'Daily']} />
            <DropDownMenu Icon={HiAdjustmentsHorizontal} flexDirection={'flex-row-reverse'} title={'Sort'} options={['Yearly', 'Monthly', 'Weekly', 'Daily']} />
          </div>
        </div>
        {/* Graph content will go here */}
      </div>
    </div>
  );
};
