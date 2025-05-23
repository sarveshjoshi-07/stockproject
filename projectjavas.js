const stockInput = document.getElementById('stock-input');
const searchBtn = document.getElementById('search-btn');
const stockName = document.getElementById('stock-name');
const stockPrice = document.getElementById('price-value');
const stockChange = document.getElementById('change-value');
const stockChart = document.getElementById('stock-chart').getContext('2d');

let chart;

const API_KEY = 'A86P04LPXN3MK3U4';

async function fetchStockData(symbol) {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data['Time Series (Daily)']) {
      updateUI(symbol, data['Time Series (Daily)']);
    } else if (data['Error Message']) {
      alert('Invalid stock symbol! Please check the symbol and try again.');
    } else {
      alert('Unexpected error occurred. Please try again later.');
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    alert('Network issue or API limit exceeded. Please try again later.');
  }
}

function updateUI(symbol, timeSeries) {
  const dates = Object.keys(timeSeries).slice(0, 15); // Last 15 days
  const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

  if (prices.length < 2) {
    alert('Insufficient data available for this stock.');
    return;
  }

  const latestPrice = prices[0];
  const previousPrice = prices[1];
  const changePercent = (((latestPrice - previousPrice) / previousPrice) * 100).toFixed(2);

  stockName.textContent = symbol.toUpperCase();
  stockPrice.textContent = `$${latestPrice.toFixed(2)}`;

  // Dynamic color change for price difference
  stockChange.textContent = `Change: ${changePercent}%`;
  stockChange.style.color = changePercent >= 0 ? 'green' : 'red';

  updateChart(dates.reverse(), prices.reverse());
}

function updateChart(dates, prices) {
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(stockChart, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Stock Price (USD)',
        data: prices,
        backgroundColor: 'rgba(130, 92, 255, 0.2)',
        borderColor: '#825CFF',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#825CFF',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#6b4ae8'
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 2000,
        easing: 'easeInOutCubic'
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#333',
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#825CFF',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 5
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#333'
          }
        },
        y: {
          grid: {
            color: 'rgba(130, 92, 255, 0.1)'
          },
          ticks: {
            color: '#333'
          }
        }
      }
    }
  });
}

searchBtn.addEventListener('click', () => {
  const symbol = stockInput.value.trim();
  if (symbol) {
    fetchStockData(symbol);
  } else {
    alert('Please enter a stock symbol!');
  }
});
