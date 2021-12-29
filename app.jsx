import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from "ethers";
import green2CleanNFT from './utils/Green2CleanNFT.json';

// Constants
const TWITTER_HANDLE = 'Green2CIean';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0xe31c71D2eEF7044098115dd00296ad7291A2099e";
const COLLECTION_ADDRESS = `https://testnets.opensea.io/collection/green2cleancollection-v2`
const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId)
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("Please connect to the Rinkeby Test Network.");
    }
    if (!ethereum) {
      console.log("Metamask not found.");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Metamask not detected.");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener()
    } catch (error) { console.log(error) }
  }
  const setupEventListener = async () => {
    try { 
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, green2CleanNFT.abi, signer);
        //
        connectedContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Mint successful. It can take a few minutes to show up. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });
        console.log("Setup event listener")
      } else {
        console.log("Ethereum object doesn't exist.");
      }
    } catch (error) {
      console.log(error)
    }      
  }
  const askContractToMintNFT = async () => {
    try { 
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, green2CleanNFT.abi, signer);
        console.log("Asking wallet for gas..")
        let nftTxn = await connectedContract.makeNFT();
        console.log("Mining.. please wait.")
        console.log(nftTxn)
        await nftTxn.wait();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else { console.log("Ethereum    object doesn't exist."); }
      }catch (error) {
        console.log(error)
      } 
  }
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Green2Clean NFT Collection</p>
          <p className="sub-text">
            3 Words Mashed Together For No Real Reason
          </p>
          <p>
          <a className="cta-button opensea-button" href={COLLECTION_ADDRESS} target="_blank"
          >View On OpenSea</a>
          </p>
          {currentAccount === "" ? (
          renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNFT} className="cta-button connect-wallet-button">
            Mint NFT </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;