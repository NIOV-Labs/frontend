import { BACKEND_URL } from "./BackendURL";

const BASE_URL = `${BACKEND_URL}/api`;

export async function createABT(data, chainId) {
  try {
    const response = await fetch(`${BASE_URL}/token/0?chainId=${chainId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error minting ABT:', error);
    throw error;
  }
}

export async function fetchABT(id, chainId) {
  try {
    const response = await fetch(`${BASE_URL}/token/${id}?chainId=${chainId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting ABT info:', error);
    throw error;
  }
}

export async function createPDF(data) {
  try {
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error minting ABT:', error);
    throw error;
  }
}

export async function fetchABTs(ids, chainId) {
  try {
    const queryString = ids.map(id => `tokenIds=${id}`).join('&');
    const response = await fetch(`${BASE_URL}/tokens?${queryString}&chainId=${chainId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting ABT info:', error);
    throw error;
  }
}

export async function getSoldABTs(wallet, chainId) {
  try {
    const response = await fetch(`${BASE_URL}/soldABTs?wallet=${wallet}&chainId=${chainId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting sold ABTs:', error);
    throw error;
  }
}

export async function getGrossRevenue(wallet, chainId) {
  try {
    const response = await fetch(`${BASE_URL}/grossRevenue?wallet=${wallet}&chainId=${chainId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting gross revenue:', error);
    throw error;
  }
}

export async function exportMarketplaceData(wallet, chainId) {
  try {
    const response = await fetch(`${BASE_URL}/exportMarketplaceData?wallet=${wallet}&chainId=${chainId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `marketplace_data_${Date.now()}_${wallet}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Error exporting marketplace data:', error);
    throw error;
  }
}