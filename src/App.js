import './App.css';
import { useState, useEffect } from 'react';
import web3 from './web3.js';
import lottery from './lottery.js';

function App() {

  const [manager, setManager] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState(null);

  useEffect ( () => {
      const getManager = async ()  => {
        
         const managerId = await lottery.methods.manager().call();
         const currAddress = await web3.eth.getAccounts();
 
         setManager(managerId);
         setAddress(currAddress[0]);

      }
      getManager();
  });

  const onSubmitForm = async (e) => {
  
    e.preventDefault();

    try {
      const accounts = await web3.eth.getAccounts();
 
      setMessage("Waiting on transaction success...");
  
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });
    
      setMessage("You have been entered!");
    } catch (error) {
      if (error.code === 100) {
        setMessage("Transaction rejected by the user.");
      } else {
        setMessage("An error occurred: " + error.message + error.code);
      }
    }
    
  }
  
  const pickWinner =  async (e) => {
    const accounts = await web3.eth.getAccounts();
 
    setMessage("Waiting on transaction success...");
 
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
 
    setMessage("A winner has been picked!");
  }
  return (
    <div className="App">
       <h2>Lottery Contest</h2>
       <p> This Lottery is organised by {manager}</p>
       <form onSubmit={onSubmitForm}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>
 
      <hr />
      
      {address === manager ?
        <div>
          <h4>Ready to pick a winner?</h4>
          <button onClick={pickWinner}>Pick a winner!</button>
        </div>
        :
        <h3>winner is not announced yet !!!</h3>
      }
 
      <hr />
 
      <h1>{message}</h1>
    </div>
  );
}

export default App;
