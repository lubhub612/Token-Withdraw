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


  /*const handleWithdraw = async () => {
    if (window.ethereum.networkVersion !== '80001') {
      toast.error('Please connect to Polygon Testnet');
    }
    // handleClose();
    if (!userAddress) {
      return toast.error('Please connect Metamask first.');
    }
    if (withdrawValue < 10) {
      return toast.error('Amount should be greater than 10');
    }
    // if (withdrawValue > userWithdrawBalance) {
    //   return toast.error('Amount should not be greater than Balance.');
    // }
    console.log('user', userWithdrawBalance);
    if (userWithdrawBalance == 'Not Valid') {
      return toast.error('Insufficient balance to withdraw!.');
    }
    let url = `https://metabitclub.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/usd_balance.php?address=${userAddress}`;

    let fetchWIthdrawBalanceHalfValue = await axios
      .get(url)
      .then((res, err) => {
        console.log('🚀 ~ .then ~ err', err);
        if (err) throw err;
        console.log(res, 'res');
        return res;
      });

    if (withdrawValue > userWithdrawBalance) {
      return toast.error('Amount should not be greater than Balance.');
    }

    setHandleWithdrawLoader(true);
    try {
      setShowDanger(true);

      console.log(
        '🚀 ~ handleWithdraw ~ fetchWIthdrawBalanceHalfValue',
        fetchWIthdrawBalanceHalfValue
      );
      let _w = fetchWIthdrawBalanceHalfValue.data;
      let w = _w;
      console.log('🚀 ~ handleWithdraw ~ w', w);

      let amount = Math.round(withdrawValue);
      console.log('amount', amount);

      let tenpercent = (amount * 10) / 100;
      let _sendCOntract = amount - tenpercent;

      let value = bigInt(_sendCOntract * 10 ** 18);
      console.log('🚀 ~ handleWithdraw ~ tenpercent', tenpercent);

        let formdata = new FormData();
        formdata.append('address', userAddress);
        formdata.append('amount', withdrawValue);
        let withdraw1 = axios
          .post(
            `https://metabitclub.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/redeem.php`,
            formdata
          )
          .then((res, err) => {
            if (res) {
              getUserWalletBalance();
              // return res;
            }
            if (err) {
              console.log(err);
            }
          });

      const withdraw = await MLM._withdrawalBusd(value.toString());

      const waitforTx = await withdraw.wait();
      if (waitforTx) {
        setHandleWithdrawLoader(false);
        toast.success('Withdraw successful.');
        // let formdata = new FormData();
        // formdata.append('address', userAddress);
        // formdata.append('amount', withdrawValue);
        // let withdraw = axios
        //   .post(
        //     `https://metabitclub.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/redeem.php`,
        //     formdata
        //   )
        //   .then((res, err) => {
        //     if (res) {
        //       getUserWalletBalance();
        //       return res;
        //     }
        //     if (err) {
        //       console.log(err);
        //     }
        //   });
        setShowDanger(false);
      }
    } catch (error) {
      console.log(error);
      setHandleWithdrawLoader(false);
      toast.error('Something went wrong.');
      setShowDanger(false);
    }
  };
*/
  const handleWithdrawNew = async () => {
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

    if (withdrawValue > userWithdrawBalance) {
      return toast.error('Amount should not be greater than Balance.');
    }

    setHandleWithdrawLoader(true);
    try {
      setShowDanger(true);
      setShow(false)
      console.log(
        '🚀 ~ handleWithdraw ~ fetchWIthdrawBalanceHalfValue',
        withdrawValue
      );
     
      if(tokenValue === 'DOT') {
      const withdraw = await MLMnew._withdrawCoin(Number(1), ethers.utils.parseEther(withdrawValue) );

      const waitforTx = await withdraw.wait();
      if (waitforTx) {
        setHandleWithdrawLoader(false);
        toast.success('Withdraw successful.');
        
        setShowDanger(false);
      }
    } else {
      
        const withdraw = await MLMnew._withdrawCoin(Number(0),  ethers.utils.parseEther(withdrawValue) );
  
        const waitforTx = await withdraw.wait();
        if (waitforTx) {
          setHandleWithdrawLoader(false);
          toast.success('Withdraw successful.');
          
          setShowDanger(false);
        }
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
    let url = `https://metabitclub.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/usd_balance.php?address=${userAddress}`;

    let bal = await axios.get(url).then((res, err) => {
      if (err) {
        setUserValid(false);
        console.log('err', err);
      }
      if (res) {
        console.log('🚀 ~ bal ~ res', res);
        setUserValid(true);
        return res;
      }
    });
    setUserWithdrawBalance(bal.data);
  };
  


  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="container-fluid pt-3">
        <div className="row">
          <div className="col-6">
            <a
              className="dashBoard wallet dashboard text-white"
              href={`https://metabitclub.com/dashboard/home.php?address=${userAddress}`}
            >
              Dashboard
            </a>
          </div>
          <div className="col-6 d-flex justify-content-end">
            {userAddress ? (
              <button
                className="dashBoard wallet dashboard"
                // onClick={handleWalletConnect}

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
                    src="https://metabitclub.com/images/navLogo.png "
                    alt="metabitclub"
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
                    (My Balance) - ({userWithdrawBalance}
                    {'USDT'})
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
            </div>

            {userValid ? (
              <div className="row   pb-4">
                <div className="dashBoard dashBoard2 pt-4 text-center">
                  <>
                    {!handleWithdrawLoader ? (
                      <button
                        className="btn btn-outline border-white text-white withdrawButton dashboard"
                        // onClick={() => handleWithdraw()}
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
          <Button variant="primary" onClick={handleWithdrawNew}>
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