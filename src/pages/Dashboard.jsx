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
    } finally {
      setLoadingProceeds(false)
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
        <ABTContainer title={'Unclaimed Proceeds'} value={`$${userProceeds.usdPennyValue}`} badgeValue={`${userProceeds.rawValue} Ξ`} funds={userProceeds.rawValue !== 0} loading={loading} loadingProceeds={loadingProceeds} handleClaim={handleClaimingProceeds} />
        <ABTContainer title={'Total ABT sold'} value={14} badgeValue={43} />
        <ABTContainer title={'Gross Revenue'} value={'$12,230'} badgeValue={'+45%'} revenueTime={revenueTime} setRevenueTime={setRevenueTime} revenueTimeFrames={revenueTimeFrames} />
        <GraphContainer title={`Active Listing's`}/>
        <GraphContainer title={`Newly Created ABT's`}/>
        <GraphContainer title={`Pending Offers`}/>
        <DesktopGraphContainer />
      </div>
    </>
  );
};

export default Dashboard;

const ABTContainer = ({title, value, badgeValue, revenueTime, setRevenueTime, revenueTimeFrames, funds, loading, loadingProceeds, handleClaim }) => {
  const revenue = title === 'Gross Revenue';
  const proceeds = title === 'Unclaimed Proceeds'
  return (
    <div className={` ${proceeds ? 'cursor-pointer' : ''} relative w-full p-3 bg-[#F9FAFF] border-2 border-slate-300 flex flex-col justify-between items-start md:col-span-2 min-[1500px]:col-span-2 ${revenue ? 'col-span-1 min-[370px]:col-span-2' : 'col-span-1'}`}>
      { loading ? ( 
        <Loader />
      ) : (
        <>
          <div className="flex justify-between items-center relative w-full">
            <p className="text-sm lg:text-base">{title}</p>
            {revenue && <DropDownMenu Icon={FiChevronDown} flexDirection={''} title={revenueTime} options={revenueTimeFrames} setOptionState={setRevenueTime} />}
          </div>
          <h1 className="text-3xl lg:text-4xl my-4 font-semibold">{value}</h1>
          <div className={`flex items-center ${proceeds ? 'gap-0 justify-between w-full' : 'gap-2 justify-start'}`}>
            { !proceeds && <p className="text-sm lg:text-base">{revenue ? '24h Inflow' : 'Layers'}</p>}
            <div className={`${proceeds ? 'text-md lg:text-md px-0' : 'text-xs lg:text-sm px-2'}  ${revenue ? 'bg-green-400 text-black' :  proceeds ? 'px-0 font-bold' :  'bg-slate-800 text-white'} py-[2px] rounded-full`}>
              {badgeValue}
            </div>
            {proceeds && funds && 
              <button onClick={handleClaim} disabled={loadingProceeds} type="button" className="text-white bg-accent2 focus:ring-4 h-full cursor-pointer focus:ring-blue-300 font-semibold rounded text-sm px-3 text-center  inline-flex items-center">
                  {loadingProceeds ? (
                    <>
                      <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Claim?'
                  )}
              </button>
            }
          </div>
        </>
        
      )}
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
