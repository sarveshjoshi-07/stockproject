# Stockpricetracker 
its all about the analysis of stocks in world 
Freaking guys are working on it it's disclamer!!


const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open('GET', 'https://indian-stock-exchange-api2.p.rapidapi.com/corporate_actions?stock_name=infosys');
xhr.setRequestHeader('x-rapidapi-key', '44b090ba9bmsh8314faab4f337dcp1c8ce3jsn52d5a86a2717');
xhr.setRequestHeader('x-rapidapi-host', 'indian-stock-exchange-api2.p.rapidapi.com');

xhr.send(data);

API :
R4ZNQJNS9CIP4KAB
SC4O05N5J0NQB0LZ
