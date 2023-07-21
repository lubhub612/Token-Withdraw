import React, {useState, useEffect} from 'react';
import MLM from '../contract/MLM';
import MLMold2 from "../contract/MLMnew";
import MLMold1 from "../contract/MLMlatest";
import MLMnew from "../contract/MLMlatestnew";
import ClientTOKEN from "../contract/ClientToken";
import USDTTOKEN from "../contract/USDTToken";
import {ToastContainer, toast} from 'react-toastify';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {providers} from 'ethers';
import bigInt from 'big-integer';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ethers } from 'ethers';

export default function Home() {
  const [userAddress, setUserAddress] = useState('');
  const [withdrawValue, setWithdrawValue] = useState('');
  const [tokenValue, setTokenValue] = useState('USDT');
  const [handleWithdrawLoader, setHandleWithdrawLoader] = useState(false);
  const [userWithdrawBalance, setUserWithdrawBalance] = useState(0);
  const [userWithdrawTokenBalance, setUserWithdrawTokenBalance] = useState(0);
  const [userWithdrawLimitBalance, setUserWithdrawLimitBalance] = useState(0);
  const [userWithdrawTokenLimitBalance, setUserWithdrawTokenLimitBalance] = useState(0);
  const [userValid, setUserValid] = useState(false);
  const [tokenPrice, setTokePrice] = useState(0);
  const [show, setShow] = useState(false);
  const [popUpwithdrawValue, setPopupWithdrawValue] = useState('');
  const [popUpClaimValue, setPopupClaimValue] = useState('');
  const [showDanger, setShowDanger] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);

    // getPopUpValue();
  };

  const provider = new WalletConnectProvider({
    infuraId: '049ddee4d6764f11b94dfab09bf85fc9',
    qrcodeModalOptions: {
      desktopLinks: [
        'ledger',
        'metamask',
        'tokenary',
        'wallet',
        'wallet 3',
        'secuX',
        'ambire',
        'wallet3',
        'apolloX',
        'zerion',
        'sequence',
        'punkWallet',
        'kryptoGO',
        'nft',
        'riceWallet',
        'vision',
        'keyring'
      ],
      mobileLinks: [
        'rainbow',
        'metamask',
        'argent',
        'trust',
        'imtoken',
        'pillar'
      ]
    }
  });


  useEffect(() => {
    if (userAddress) {
      getUserWalletBalance();
      getUserWalletTokenBalance();
      getUserUsdtLimitBalance();
      getUserTokenLimitBalance();
    }
    return () => {};
  }, [userAddress]);

  const handleWalletConnect = async () => {
    // try {
    //   await provider.enable();
    // } catch (error) {}
    if (window.ethereum) {
      window.ethereum
        .request({method: 'eth_requestAccounts'})
        .then(handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
          } else {
            console.error(err);
          }
        });
      return true;
    } else {
      console.log('Please connect to MetaMask.');
      return false;
    }
  };
  function handleAccountsChanged(accounts) {
    let currentAccount;

    if (window.ethereum) {
      if (window.ethereum.networkVersion !== '80001') {
        toast.error('Please connect to Polygon Testnet');
      }
    }

    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      // console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      setUserAddress(currentAccount);

      // Do any other work!
    }
  }


  

  const handleWithdraw = async () => {
    if (window.ethereum.networkVersion !== '80001') {
      return toast.error('Please connect to Polygon Testnet');
    }
   
    if (!userAddress) {
      return toast.error('Please connect Metamask first.');
    }
    if (withdrawValue < 1) {
      return toast.error('Amount should be greater than 1');
    }

    if (!tokenValue) {
      return toast.error("Please choose token first!");
    }

    // if (withdrawValue > userWithdrawBalance) {
    //   return toast.error('Amount should not be greater than Balance.');
    // }
    console.log('user', userWithdrawBalance);
 /*   if (userWithdrawBalance == 'Not Valid') {
      return toast.error('Insufficient balance to withdraw!.');
    }
     */

 /*   if (withdrawValue > userWithdrawBalance) {
      setShow(false)
      return toast.error('Amount should not be greater than Balance.');
    }  */

    setHandleWithdrawLoader(true);
    try {
      setShowDanger(true);
      setShow(false)
      console.log(
        '🚀 ~ handleWithdraw ~ fetchWIthdrawBalanceHalfValue',
        withdrawValue
      );
     
      if(tokenValue === 'DOT') {
       if (withdrawValue > userWithdrawTokenLimitBalance) {
          setHandleWithdrawLoader(false);
      setShowDanger(false);
          return toast.error('Amount should not be greater than Withdraw   Balance.');
        } 
        let formData = new FormData();
        formData.append('address', userAddress);
        formData.append('amount', withdrawValue);
         let withdrawApi = await axios.post(`https://federalcoin.social/dashboard/api/coin_redeem.php`, formData).then(async (res, err) => {
            if (res) {
             console.log(res)
             const withdraw = await MLMnew._withdrawCoin(Number(1), ethers.utils.parseEther(withdrawValue) );

      const waitforTx = await withdraw.wait();
      if (waitforTx) {
        getUserWalletTokenBalance();
        setHandleWithdrawLoader(false);
        toast.success('Withdraw successful.');
        
       
      }
              return res;
  
            }
            if (err) {
              console.log(err);
            };
          });
          setShowDanger(false);
          console.log("🚀 ~ const_handleDeposit= ~ depositApi", withdrawApi);
    } else {
      if (withdrawValue > userWithdrawLimitBalance) {
        setHandleWithdrawLoader(false);
      setShowDanger(false);
        return toast.error('Amount should not be greater than Withdraw  Balance.');
        
      }
      let formData = new FormData();
        formData.append('address', userAddress);
        formData.append('amount', withdrawValue);

       
  let withdrawApi = await axios.post(`https://federalcoin.social/dashboard/api/redeem.php`, formData).then(async (res, err) => {
            if (res) {
             console.log(res)
             const withdraw = await MLMnew._withdrawCoin(Number(0),  ethers.utils.parseEther(withdrawValue) );
        const waitforTx = await withdraw.wait();
        if (waitforTx) {
          getUserWalletBalance();
          setHandleWithdrawLoader(false);
          toast.success('Withdraw successful.');
          
          
        }
        return res;
  
            }
            if (err) {
              console.log(err);
            };
          });
          console.log("🚀 ~ const_handleDeposit= ~ depositApi", withdrawApi);
          setShowDanger(false);
    } 
    } catch (error) {
      console.log(error);
      let _par = JSON.stringify(error);
      let _parse = JSON.parse(_par);
      if (_parse?.reason) {
        toast.error(_parse?.reason);
      } else {
        toast.error("Something went wrong!");
      }
      setHandleWithdrawLoader(false);
      setShowDanger(false);
    }
  };


  const getUserWalletBalance = async () => {

    

    try {
      
      let url = `https://federalcoin.social/dashboard/api/usd_balance.php?address=${userAddress}`;
      let bal = await axios.get(url).then((res, err) => {
        if (err) {
          setUserValid(false);
          console.log("err", err);
        }
        if (res) {
          console.log("🚀 ~ bal ~ res", res);
          setUserValid(true);
          return res;
        }
      });
      console.log("🚀 ~ bal ~ bal", bal);
      if (bal.data == "Not Valid") {
        setUserWithdrawBalance(0);
      } else {
        setUserWithdrawBalance(bal.data);
      }
    } catch (error) {
      console.log("🚀 ~ getUserWalletBalance ~ error", error);
    }
  };

   const getUserWalletTokenBalance = async () => {

    
    try {
      
      let url = `https://federalcoin.social/dashboard/api/coin_balance.php?address=${userAddress}`;
      let bal = await axios.get(url).then((res, err) => {
        if (err) {
          setUserValid(false);
          console.log("err", err);
        }
        if (res) {
          console.log("🚀 ~ bal ~ res", res);
          setUserValid(true);
          return res;
        }
      });
      console.log("🚀 ~ bal ~ bal", bal);
      if (bal.data == "Not Valid") {
        setUserWithdrawTokenBalance(0);
      } else {
        setUserWithdrawTokenBalance(bal.data);
      }
    } catch (error) {
      console.log("🚀 ~ getUserWalletBalance ~ error", error);
    }
  };


  const getUserUsdtLimitBalance = async () => {

    
    try {
      
      let url = `https://federalcoin.social/dashboard/api/balance.php?address=${userAddress}`;
      let bal = await axios.get(url).then((res, err) => {
        if (err) {
          setUserValid(false);
          console.log("err", err);
        }
        if (res) {
          console.log("🚀 ~ bal ~ res", res);
          setUserValid(true);
          return res;
        }
      });
      console.log("🚀 ~ bal ~ bal", bal);
      if (bal.data == "Not Valid") {
        setUserWithdrawLimitBalance(0);
      } else {
        setUserWithdrawLimitBalance(bal.data);
      }
    } catch (error) {
      console.log("🚀 ~ getUserWalletBalance ~ error", error);
    }
  };

   const getUserTokenLimitBalance = async () => {

    
    
    try {
      
      let url = `https://federalcoin.social/dashboard/api/coin_balance1.php?address=${userAddress}`;
      let bal = await axios.get(url).then((res, err) => {
        if (err) {
          setUserValid(false);
          console.log("err", err);
        }
        if (res) {
          console.log("🚀 ~ bal ~ res", res);
          setUserValid(true);
          return res;
        }
      });
      console.log("🚀 ~ bal ~ bal", bal);
      if (bal.data == "Not Valid") {
        setUserWithdrawTokenLimitBalance(0);
      } else {
        setUserWithdrawTokenLimitBalance(bal.data);
      }
    } catch (error) {
      console.log("🚀 ~ getUserWalletBalance ~ error", error);
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="container-fluid pt-3">
        <div className="row">
          <div className="col-6">
            <a
              className="dashBoard wallet dashboard text-white"
              href={`https://federalcoin.social/dashboard/dashboard.php?address=${userAddress}`}
            >
              Dashboard
            </a>
          </div>
          <div className="col-6 d-flex justify-content-end">
            {userAddress ? (
              <button
                className="dashBoard wallet dashboard"
                
                disabled
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: '160px',
                  whiteSpace: 'nowrap',
                  color: 'white'
                }}
              >
                {' '}
                {userAddress}
              </button>
            ) : (
              <button
                className="dashBoard wallet2 dashboard"
                onClick={handleWalletConnect}
              >
                {' '}
                Connect Wallet{' '}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="container ">
        <div className="row d-flex justify-content-center mt-5 pt-4">
          <div
            className="col-lg-5 col-md-8   shadow2 rounded-1"
            style={{
              backgroundColor: ' rgb(245,245,245)'
            }}
          >
            <div className="col pb-4 ">
              <div className="row ">
                <div className="col-12 d-grid justify-content-center">
                  <img
                  
                  src='/assets/fdr_logo.png'
                    alt="logo"
                  />
                  <h2 className="text-center pb-4" style={{
                    color: ' rgb(20 21 51)'
                  }}>WITHDRAWAL</h2>
                </div>
                <div className="col-12 ">
                  <p
                    className="ps-2  border mx-3 py-2 "
                    style={{
                      backgroundColor: '#D9D9D9',
                      borderRadius: '5px',
                      color: '#2f323b ',
                      fontWeight: '500',
                      fontSize: '20px'
                    }}
                  >
                    (My Balance) - ( {tokenValue === 'USDT' ? userWithdrawBalance : userWithdrawTokenBalance }
                              {tokenValue })
                  </p>
                </div>
              </div>
              <div className="row  mx-2 ">
              
                 <div className='col d-flex '>
                   
                        <select value={tokenValue}  onChange={(e) => setTokenValue(e.target.value)}  style= {{backgroundColor: ' rgb(20 21 51)',  color: 'rgb(255 255 255)',  border: '8' ,  }}>
                            <option value="USDT">USDT</option>
                            <option value="DOT">TOKEN</option>
                         </select>
                      </div>
                      <div className='col-9'>
                      <input
                            style={{
                              backgroundColor: "#D9D9D9",
                              borderRadius: "5px",
                              color: "#2f323b ",
                              fontWeight: "500",
                              fontSize: "18px",
                            }}
                            className="form-control "
                            type="text"
                            placeholder="Enter Token Value"
                            aria-label="default input example"
                            value={withdrawValue}
                            onChange={(e) => setWithdrawValue(e.target.value)}
                              
                          />
                          
                         
                      </div>
                    
              </div>  
              <div className="row  mx-2">
                        <div className="col d-flex  ">
                        <p
                            className=" pt-2"
                            style={{ fontSize: "16px" , 
                              color: ' rgb(20 21 51)'
                            }}
                          >
                            Withdraw Balance : {tokenValue === 'USDT' ? userWithdrawLimitBalance : userWithdrawTokenLimitBalance } {tokenValue}
                          </p>
                          </div>
                      </div>
            </div>

            {userValid ? (
              <div className="row   pb-4">
                <div className="dashBoard dashBoard2 pt-4 text-center">
                  <>
                    {!handleWithdrawLoader ? (
                      <button
                        className="btn btn-outline border-white text-white withdrawButton dashboard"
                        
                        onClick={handleShow}
                      
                      >
                        Withdraw
                      </button>
                    ) : (
                      <div class="spinner-border text-success" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      {handleWithdrawLoader ? (
        <div className="alert alert-warning bg-danger text-light" role="alert">
          Don't refresh the page, otherwise you lost your money.
        </div>
      ) : (
        ''
      )}
      <div className="container text-center mt-3 ps-3">
        <div className="row">
          <div className="col">
            &#169; 2023{' '}
            <span
              style={{
                color: 'white'
              }}
            >
              {' '}
              Metabit Club{' '}
            </span>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="text-dark">Transaction </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-dark">Are you sure wanted to process this transaction?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Reject
          </Button>
          <Button variant="primary" onClick={handleWithdraw}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {showDanger ? (
        <div class="alert alert-danger text-center" role="alert">
          Please don't refresh the page, Otherwise you lost your money.
        </div>
      ) : (
        ''
      )}{' '}
    </>
  );
}
