const stockInput = document.getElementById('stock-input');
const searchBtn = document.getElementById('search-btn');
const stockName = document.getElementById('stock-name');
const stockPrice = document.getElementById('stock-price');
const stockChange = document.getElementById('stock-change');
const stockChart = document.getElementById('stock-chart').getContext('2d');

let chart;

const API_KEY = 'demo';

async function fetchStockData(symbol) {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data['Time Series (Daily)']) {
      updateUI(symbol, data['Time Series (Daily)']);
    } else {
      alert('Stock not found! Please check the symbol and try again.');
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    alert('Failed to fetch stock data. Please try again later.');
  }
}

function updateUI(symbol, timeSeries) {
  const dates = Object.keys(timeSeries).slice(0, 15); // Last 15 days
  const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

  const latestPrice = prices[0];
  const previousPrice = prices[1];
  const changePercent = (((latestPrice - previousPrice) / previousPrice) * 100).toFixed(2);

  stockName.textContent = symbol.toUpperCase();
  stockPrice.textContent = `Price: $${latestPrice.toFixed(2)}`;
  stockChange.textContent = `Change: ${changePercent}%`;

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
      datasets: [
        {
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
          pointHoverBackgroundColor: '#6b4ae8',
        },
      ],
    },
    options: {
      responsive: true,
      animation: {
        duration: 2000,
        easing: 'easeInOutCubic',
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#333',
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#825CFF',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 5,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#333',
          },
        },
        y: {
          grid: {
            color: 'rgba(130, 92, 255, 0.1)',
          },
          ticks: {
            color: '#333',
          },
        },
      },
    },
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
