import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import "./styles/Home.css";
import BannerImage from "./assets/solanatom_home_banner.jpg";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

// Carousel imgs
import carousel1 from "./assets/carousel/1.jpg";
import carousel2 from "./assets/carousel/2.jpg";
import carousel3 from "./assets/carousel/3.jpg";
import carousel4 from "./assets/carousel/4.jpg";
import carousel5 from "./assets/carousel/5.jpg";
import carousel6 from "./assets/carousel/6.jpg";
import carousel7 from "./assets/carousel/7.jpg";
import carousel8 from "./assets/carousel/8.jpg";
import carousel9 from "./assets/carousel/9.jpg";
import carousel10 from "./assets/carousel/10.jpg";
import carousel11 from "./assets/carousel/11.jpg";
import carousel12 from "./assets/carousel/12.jpg";
import carousel13 from "./assets/carousel/13.jpg";
import carousel14 from "./assets/carousel/14.jpg";
import carousel15 from "./assets/carousel/15.jpg";
import carousel16 from "./assets/carousel/16.jpg";
import carousel17 from "./assets/carousel/17.jpg";
import carousel18 from "./assets/carousel/18.jpg";
import carousel19 from "./assets/carousel/19.jpg";
import carousel20 from "./assets/carousel/20.jpg";


import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const Home = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const hRedStyle = { color: "red" };
  const hWhiteStyle = { color: "white" };
  const hBlueStyle = { color: "blue" };
  const hBlackStyle = { color: "black" };


  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        candyMachine,
        goLiveDate,
        itemsAvailable,
        itemsRemaining,
        itemsRedeemed,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsAvailable(itemsAvailable);
      setItemsRemaining(itemsRemaining);
      setItemsRedeemed(itemsRedeemed);

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  };

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <main className="main">


      <div className="navbar">
        {wallet && (
                <p>Wallet {shortenAddress(wallet.publicKey.toBase58() || "")}</p>
              )}
              <div></div>
        <div className="navbar-right">
          <ConnectButton>{wallet ? "Connected" : "Connect Wallet" }</ConnectButton>
        </div>
      </div>

      <div className="home" style={{ backgroundImage: `url(${BannerImage})` }}>
        <div className="headerContainer">
          <h1><span style={hWhiteStyle}>Solana</span>{" "}<span style={hRedStyle}>Tom</span></h1>
          <h3>225 unique images @ 1 SOL. </h3>
          <h3> <span style={hRedStyle}>Minting begins December 15, 2021.</span></h3>
          <h5>To mint simply connect your Phantom wallet and smash that mint button.</h5>
            <MintContainer>

              <MintButton
                disabled={isSoldOut || isMinting || !isActive}
                onClick={onMint}
                variant="contained"
              >
                {isSoldOut ? (
                  "SOLD OUT"
                ) : isActive ? (
                  isMinting ? (
                    <CircularProgress />
                  ) : (
                    "MINT"
                  )
                ) : (
                  <Countdown
                    date={startDate}
                    onMount={({ completed }) => completed && setIsActive(true)}
                    onComplete={() => setIsActive(true)}
                    renderer={renderCounter}
                  />
                )}
              </MintButton>

              </MintContainer>

              {wallet && <h3>Supply: {itemsRedeemed} / {itemsAvailable}</h3>}
        </div>
      </div>

      <div></div>

      <div className="carouselContainer">
        <div className="marquee-wrapper">
          <div className="marquee">
            <img src={carousel1} alt="Solana Tom #1" />
            <img src={carousel2} alt="Solana Tom #2" />
            <img src={carousel3} alt="Solana Tom #3" />
            <img src={carousel4} alt="Solana Tom #4" />
            <img src={carousel5} alt="Solana Tom #5" />
            <img src={carousel6} alt="Solana Tom #6" />
            <img src={carousel7} alt="Solana Tom #7" />
            <img src={carousel8} alt="Solana Tom #8" />
            <img src={carousel9} alt="Solana Tom #9" />
            <img src={carousel10} alt="Solana Tom #10" />
            <img src={carousel11} alt="Solana Tom #11" />
            <img src={carousel12} alt="Solana Tom #12" />
            <img src={carousel13} alt="Solana Tom #13" />
            <img src={carousel14} alt="Solana Tom #14" />
            <img src={carousel15} alt="Solana Tom #15" />
            <img src={carousel16} alt="Solana Tom #16" />
            <img src={carousel17} alt="Solana Tom #17" />
            <img src={carousel18} alt="Solana Tom #18" />
            <img src={carousel19} alt="Solana Tom #19" />
            <img src={carousel20} alt="Solana Tom #20" />
          </div>
        </div>
      </div>

      <div className="attributes">
        <div className="leftSide text-center">
          <h1 style={hBlueStyle}>Who is Solana Tom?</h1>
          <p>Solana Tom aka Tom Terrific aka TB Tom aka 2-Rings Tom aka Pretty boy Tom is a handsome young man from Thunder Bay. His friend's call him TB Tom, and some say he bears a strong resemblence to a famous NFL quarterback. Solana Tom does not play any sports, but he is in a few fantasy football leagues and likes to dress up in his favorite jersey every Sunday.</p>
          <p>There will only be ever 225 Solana Tom NFTs minted in rare variations never seen before. Minting will commence on December 15, 2021 at 02:00:00 EST time. Pricing will be one SOL each.</p>
          <p>&nbsp;</p>
        </div>

        <div className="rightSide text-center">
          <h1 style={hRedStyle}>How to Mint</h1>
          <p>Minting a Solona Tom has never been easier! First, before you can mint, you will need a Phantom browser wallet and at least 1.01 SOL to cover the mint + tx fees.</p>
          <p>&nbsp;</p>
          <p>✅ Secure some Solana  from your favorite Crypto broker</p>
          <p>✅ Download the <a href="https://phantom.app">Phantom wallet</a> and transfer enough SOL for the transaction (~1.01 SOL)</p>
          <p>✅ Click the Connect Wallet button on the top right corner of the website </p>
          <p>✅ Click the Mint button (note you can only mint one at a time to ensure fair access) </p>
          <p>✅ Enjoy your NFT and 💰💰💰 PROFIT 💰💰💰 </p>
          <p>&nbsp;</p>


        </div>

        <div className="footer">
          <p>Follow us on <a href="https://twitter.com/sonicvapeclub" target="_blank" rel="noreferrer">Twitter</a> or join or <a href="https://discord.gg/WtzBaWbyd4" target="_blank" rel="noreferrer">Discord</a> | Solana Tom is a <a href="https://sonicvapeclub.com" target="_blank" rel="noreferrer">Sonic Vape Club</a> Production</p>
        
        </div>
      
      
      </div>




      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
      </main>

  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default Home;
