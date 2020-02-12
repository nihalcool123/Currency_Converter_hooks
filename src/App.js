import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import CurrencyRow from "./CurrencyRow";

const BASE_URL = "https://api.exchangeratesapi.io/latest";

function App() {
  const [currencyOptions, setcurrencyOptions] = useState([]);
  const [fromCurrency, setfromCurrency] = useState();
  const [toCurrency, settoCurrency] = useState();
  const [exchangeRate, setexchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setamountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0];
        setcurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setfromCurrency(data.base);
        settoCurrency(firstCurrency);
        setexchangeRate(data.rates[firstCurrency]);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(
        `${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`
      ).then(res =>
        res.json().then(data => setexchangeRate(data.rates[toCurrency]))
      );
    }
  }, [fromCurrency, toCurrency]);

  const handleFromAmountChange = e => {
    setAmount(e.target.value);
    setamountInFromCurrency(true);
  };

  const handleToAmountChange = e => {
    setAmount(e.target.value);
    setamountInFromCurrency(false);
  };

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectCurrency={fromCurrency}
        onChangeCurrency={e => setfromCurrency(e.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectCurrency={toCurrency}
        onChangeCurrency={e => settoCurrency(e.target.value)}
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </>
  );
}

export default App;
