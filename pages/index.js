import styles from '../styles/Home.module.css'
import axios from "axios";
import { useEffect, useState } from "react";
import * as gariSdk from "gari";


export default function Home() {
  const [userId, setUserid]= useState(null);
  const [wallet, setWallet] = useState(null);

  const gariClientId = "d8817deb-dceb-40a4-a890-21f0286c8fba";
  let token = ""

  
   async function getToken(userId) {
     const loginResponse = await axios.get(
       // `http://localhost:3000/api/login?userId=${userId}`
       `https://demo-gari-sdk.vercel.app/api/login?userId=${userId}`
     );
     console.log("jwtToken", loginResponse.data);
     return loginResponse.data;
   }
   async function login() {
     token = await getToken(userId);
     console.log(token);
   }
   async function getWallet(){
    try{
      const init = gariSdk.sdkInitialize({ gariClientId });
      console.log(init);
      const walletRes = await gariSdk.createWalletOrGetWallet(token);
      setWallet(walletRes);
      console.log(walletRes);
    }catch(error){
      console.log(error);
    }
   }
   async function airdrop(){
    try{
      console.log(`getAirdrop called`);
      const publicKey = wallet.publicKey;
       //const publicKey = "8kBPM2m2B4UV7sBQTgrgCmp9v5Prck3wZgZRJBaoVDff";

      const airdropSignature = await axios.post(
        `http://localhost:3000/api/airdrop`,
        // `https://demo-gari-sdk.vercel.app/api/airdrop`,
        { publicKey },
        {
          headers: {
            token,
          },
        }
      );
      console.log(
        "airdropSignature finally ------------>  ",
        airdropSignature.data)

    }catch(error){
      console.log(error)
    }
   }

   useEffect(() => {
     console.log(`gariSdk version ${gariSdk.packageVersion()}`);
     //let environment = 'devnet'; // to use mainnet pass "mainnet"
     let configDetails = {
       gariClientId,
       secretKey: undefined,
       web3authClientId: "",
       verifierName: "",
       verifierDomain: "",
       environment: "devnet",
     };
     console.log("working");
     const a = gariSdk.sdkInitialize(configDetails);
     console.log(a);
    }, []);

  return (
    <div className={styles.container}>
      <input
        label="UserId"
        variant="outlined"
        name="userId"
        margin="dense"
        required
        fullWidth
        type="number"
        onChange={(e) => setUserid(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <div>
        <p>Text details</p>
      <button onClick={getWallet}>get wallet details</button>
      </div>

      <div>
        <p>airdrop</p>
        <button onClick={airdrop}>airdrop</button>
      </div>
    </div>
  );
}
