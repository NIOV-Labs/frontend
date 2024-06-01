import { useEffect, useState } from "react";
import DropDownMenu from "../components/DropDownMenu";
import PageHeader from "../components/PageHeader";
import { FiChevronDown } from "react-icons/fi";
import { MdArrowForwardIos, MdFilterList } from "react-icons/md";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { getSoldABTs, getGrossRevenue, exportMarketplaceData, fetchABTs } from "../utilities/Contract";
import Loader from "../components/Loader";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Addresses from '../../utils/deploymentMap/31337.json';

const Dashboard = ({ client, market, abt, reader }) => {
  const [revenueTime, setRevenueTime] = useState('Yearly');
  const revenueTimeFrames = ['Yearly', 'Monthly', 'Weekly', 'Daily'];
  const [userProceeds, setUserProceeds] = useState({ rawValue: 0, usdPennyValue: '0' });
  const [soldABTs, setSoldABTs] = useState(0);
  const [grossRevenue, setGrossRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingProceeds, setLoadingProceeds] = useState(false);
  const [inflowPercentage, setInflowPercentage] = useState(0);
  const [lastSaleDate, setLastSaleDate] = useState('Never');
  const [tenProceeds, setTenProceeds] = useState([]);
  const [histogramData, setHistogramData] = useState([]);
  const [userListings, setUserListings] = useState([]);

  const loadDashboardItems = async () => {
    try {
      setLoading(true);
      const proceeds = await market.checkProceeds(client.account);
      setUserProceeds({
        rawValue: parseInt(proceeds.rawValue) / (10 ** 18),
        usdPennyValue: (parseInt(proceeds.usdPennyValue.toString()) / 100).toFixed(2)
      });

      const soldResponse = await getSoldABTs(client.account);
      setSoldABTs(soldResponse.soldABTs);
      setLastSaleDate(soldResponse.lastSaleDate ? calculateTimeSince(soldResponse.lastSaleDate) : 'Never');

      const revenueResponse = await getGrossRevenue(client.account);
      setGrossRevenue(revenueResponse.grossRevenue / 100); // Assuming the revenue is in pennies
      setInflowPercentage(revenueResponse.inflowPercentage);
      setTenProceeds(revenueResponse.tenProceeds); // Set the last ten proceeds
      setHistogramData(revenueResponse.histogram); // Set the histogram data

      const tokens = await abt.numTokens();
      const numTokens = parseInt(tokens);
      if (numTokens > 0) {
        const ids = Array.from({ length: numTokens }, (_, index) => index + 1);
        const abtListingInfo = await reader.readListings(Addresses.AssetBoundToken, ids);
        const listingsWithTokenId = abtListingInfo.filter(listing => listing.seller.toLowerCase() === client.account.toLowerCase());
        const userListings = listingsWithTokenId.map((listing, index) => ({
          ...listing,
          tokenId: ids[index]
        }));
        const abtMetadata = await fetchABTs(userListings.map(listing => listing.tokenId));
        const listingsWithMetadata = userListings.map(listing => ({
          ...listing,
          metadata: abtMetadata.find(metadata => metadata.onChainID === listing.tokenId)
        }));
        console.log(listingsWithMetadata);
        setUserListings(listingsWithMetadata);
      }

    } catch (error) {
      console.error('Error loading dashboard items:', error);
    } finally {
      setLoading(false);
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
      setLoadingProceeds(false);
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

  const histogramChartData = {
    labels: histogramData.map(item => item.date),
    datasets: [
      {
        label: 'Revenue (USD)',
        data: histogramData.map(item => item.value / 100), // Assuming the revenue is in pennies
        backgroundColor: 'rgba(203, 213, 225, 1)',
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <PageHeader title={'Dashboard'} />
      <div className="w-full p-5 lg:p-10 grid grid-cols-1 min-[370px]:grid-cols-2 md:grid-cols-6 min-[1500px]:grid-cols-10 gap-4">
        <ABTContainer title={'Unclaimed Proceeds'} value={`$${userProceeds.usdPennyValue.toLocaleString()}`} badgeValue={`${userProceeds.rawValue} Ξ`} funds={userProceeds.rawValue !== 0} loading={loading} loadingProceeds={loadingProceeds} handleClaim={handleClaimingProceeds} />
        <ABTContainer title={'Total ABTs sold'} value={soldABTs} badgeValue={lastSaleDate} />
        <ABTContainer title={'Gross Revenue'} value={'$' + grossRevenue.toLocaleString()} badgeValue={`${inflowPercentage ? inflowPercentage.toFixed(2) : 0}%`} handleExport={handleExportData} />
        <GraphContainer title={`Proceeds`} proceeds={tenProceeds} />
        <GraphContainer title={`Active Listings`} listings={userListings} />
        <DesktopGraphContainer proceeds={tenProceeds} histogramChartData={histogramChartData} chartOptions={chartOptions} />
      </div>
    </>
  );
};

export default Dashboard;

const calculateTimeSince = (date) => {
  const now = new Date();
  const lastSale = new Date(date);
  const diffInSeconds = Math.floor((now - lastSale) / 1000);

  const days = Math.floor(diffInSeconds / (3600 * 24));
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
};

const ABTContainer = ({ title, value, badgeValue, handleExport, funds, loading, loadingProceeds, handleClaim }) => {
  const revenue = title === 'Gross Revenue';
  const proceeds = title === 'Unclaimed Proceeds';
  return (
    <div className={` ${proceeds ? 'cursor-pointer' : ''} relative w-full p-3 bg-[#F9FAFF] border-2 border-slate-300 flex flex-col justify-between items-start md:col-span-2 min-[1500px]:col-span-2 ${revenue ? 'col-span-1 min-[370px]:col-span-2' : 'col-span-1'}`}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-between items-center relative w-full">
            <p className="text-sm lg:text-base">{title}</p>
            {revenue && <button onClick={handleExport} className="text-white bg-[#a7bed8] hover:bg-[#8099b5]-700 focus:ring-4 focus:ring-blue-300 font-semibold rounded text-sm px-3 py-1 text-center inline-flex items-center">Export</button>}
          </div>
          <h1 className="text-3xl lg:text-4xl my-4 font-semibold">{value}</h1>
          <div className={`flex items-center ${proceeds ? 'gap-0 justify-between w-full' : 'gap-2 justify-start'}`}>
            {!proceeds && <p className="text-sm lg:text-base">{revenue ? '24h Inflow' : 'Last Sale:'}</p>}
            <div className={`${proceeds ? 'text-md lg:text-md px-0' : 'text-xs lg:text-sm px-2'}  ${revenue ? 'bg-green-400 text-black' : proceeds ? 'px-0 font-bold' : 'bg-slate-800 text-white'} py-[2px] rounded-full`}>
              {badgeValue}
            </div>
            {proceeds && funds && (
              <button onClick={handleClaim} disabled={loadingProceeds} type="button" className="text-white bg-accent2 focus:ring-4 h-full cursor-pointer focus:ring-blue-300 font-semibold rounded text-sm px-3 text-center inline-flex items-center">
                {loadingProceeds ? (
                  <>
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Claim?'
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const GraphContainer = ({ title, proceeds, listings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeListing = title === `Active Listings`;
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
        {activeListing && (
          <div className="flex gap-2 md:gap-6 justify-end items-center">
            <DropDownMenu Icon={MdFilterList} flexDirection={'flex-row-reverse'} title={'Filter'} options={['Yearly', 'Monthly', 'Weekly', 'Daily']} />
            <DropDownMenu Icon={HiAdjustmentsHorizontal} flexDirection={'flex-row-reverse'} title={'Sort'} options={['Yearly', 'Monthly', 'Weekly', 'Daily']} />
          </div>
        )}
        {pending && <DropDownMenu Icon={MdFilterList} flexDirection={'flex-row-reverse'} title={'Filter'} options={['Yearly', 'Monthly', 'Weekly', 'Daily']} />}
      </div>
      <div className="w-full">
        {title === 'Proceeds' && (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-[#F9FAFF] border-2 border-slate-300">Value (USD)</th>
                <th className="py-2 px-4 bg-[#F9FAFF] border-2 border-slate-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {proceeds && proceeds.map((proceed, index) => (
                <tr key={index}>
                  <td className="border py-2 px-4 border-0">${Number(proceed.usdPennyValue) / 100}</td>
                  <td className="border py-2 px-4 border-0">{calculateTimeSince(proceed.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {title === 'Active Listings' && (
          <table className="border-2 border-slate-300 min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-[#F9FAFF] border-2 border-slate-300">Preview</th>
                <th className="py-2 px-4 bg-[#F9FAFF] border-2 border-slate-300">ID</th>
                <th className="py-2 px-4 bg-[#F9FAFF] border-2 border-slate-300" style={{ width: '40%' }}>Name</th>
                <th className="py-2 px-4 bg-[#F9FAFF] border-2 border-slate-300">Price (USD)</th>
              </tr>
            </thead>
            <tbody>
              {listings && listings.map((listing, index) => (
                <tr key={index}>
                  <td className="border py-2 px-4 border-0 text-center">
                    <img src={`http://localhost:3000/uploads/${listing.metadata.images[0]}`} alt={listing.metadata.name} style={{ margin: 'auto', width: '100px', height: '100px' }} />
                  </td>
                  <td className="border py-2 px-4 border-0 text-center">{listing.tokenId}</td>
                  <td className="border py-2 px-4 border-0 text-center" style={{ width: '40%' }}>{listing.metadata.name}</td>
                  <td className="border py-2 px-4 border-0 text-center">${(Number(listing[1]) / 100).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};


const DesktopGraphContainer = ({ proceeds, histogramChartData, chartOptions }) => {
  return (
    <>
      <div className="w-full hidden min-[1500px]:flex flex-col col-span-4 row-start-1 col-start-7 justify-between items-start">
        <div className="w-full flex flex-col jusitfy-start items-start">
          <div className={`w-full flex justify-between items-center pb-2 border-b-2 border-slate-300 min-[1500px]:border-0`}>
            <Bar data={histogramChartData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="w-full hidden min-[1500px]:flex flex-col col-span-4 row-start-2 col-start-7 justify-between items-start">
        <div className="w-full flex flex-col jusitfy-start items-start">
          <div className={`w-full flex justify-between items-center pb-2 border-b-2 border-slate-300 min-[1500px]:border-0`}>
            <p className="text-xl lg:text-2xl">Proceeds</p>
            <div className="flex gap-6 justify-end items-center">
              <DropDownMenu Icon={MdFilterList} flexDirection={'flex-row-reverse'} title={'Filter'} options={['Yearly', 'Monthly', 'Weekly', 'Daily']} />
              <DropDownMenu Icon={HiAdjustmentsHorizontal} flexDirection={'flex-row-reverse'} title={'Sort'} options={['Yearly', 'Monthly', 'Weekly', 'Daily']} />
            </div>
          </div>
          <div className="w-full flex flex-col jusitfy-start items-start">
            <table className="border-2 border-slate-300 min-w-full bg-white">
              <thead className="border-0">
                <tr>
                  <th className="py-2 px-4 bg-[#F9FAFF] border-2 border-slate-300">Value (USD)</th>
                  <th className="py-2 px-4 bg-[#F9FAFF] border-2 border-slate-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {proceeds && proceeds.map((proceed, index) => (
                  <tr key={index} className="border-0 border-slate-300">
                    <td className="border py-2 px-4 border-0 text-center">${(proceed.usdPennyValue / 100).toFixed(2)}</td>
                    <td className="border py-2 px-4 border-0 text-center">{calculateTimeSince(proceed.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
