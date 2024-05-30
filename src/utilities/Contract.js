const BASE_URL = 'http://localhost:3000/api';

export async function createABT(data) {
  try {
    const response = await fetch(`${BASE_URL}/token/0`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log(response)
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error minting ABT:', error);
    throw error;
  }
}


export async function fetchABT(id) {
  try {
    const response = await fetch(`${BASE_URL}/token/${id}`, {
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
      console.log(response)
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error minting ABT:', error);
    throw error;
  }
}

export async function fetchABTs(ids) {
  try {
    const queryString = ids.join('&tokenIds=');
    const response = await fetch(`${BASE_URL}/tokens?tokenIds=${queryString}`, {
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

export async function getSoldABTs(wallet) {
  try {
    const response = await fetch(`${BASE_URL}/soldABTs?wallet=${wallet}`, {
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

export async function getGrossRevenue(wallet) {
  try {
    const response = await fetch(`${BASE_URL}/grossRevenue?wallet=${wallet}`, {
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

export async function exportMarketplaceData(wallet) {
  try {
    const response = await fetch(`${BASE_URL}/exportMarketplaceData?wallet=${wallet}`, {
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