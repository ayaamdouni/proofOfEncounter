/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  Platform,
  useColorScheme,
  PermissionsAndroid,
  View,
} from 'react-native';
import ContractConnect from './src/ContractConnect';
import InitEncounterTx from './src/initEncounterTx';
import {NativeModules} from 'react-native';
import '@walletconnect/react-native-compat';
import {WagmiConfig} from 'wagmi';
import {mainnet, polygon, arbitrum, sepolia} from 'viem/chains';
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
} from '@web3modal/wagmi-react-native';
import {W3mButton} from '@web3modal/wagmi-react-native';
import {getAccount} from '@wagmi/core';
const PROJECTID = '91c6dd7306179066910230868eabcb55';
const projectId = PROJECTID;

const metadata = {
  name: 'Web3Modal RN',
  description: 'Web3Modal RN Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

const chains = [sepolia, mainnet, polygon, arbitrum];

const wagmiConfig = defaultWagmiConfig({chains, projectId, metadata});

createWeb3Modal({
  projectId: PROJECTID,
  chains,
  wagmiConfig,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

const {NearbyModule} = NativeModules;
console.log(NearbyModule);
NearbyModule.createNearbyEvent('aya', 'tunisie');
const App = () => {
  const [discoveredEndpoints, setDiscoveredEndpoints] = useState([]);
  const [account, setAccount] = useState(null);
  const [initTest, setInitTest] = useState(false);
  const connect = async () => {};

  const startDiscovering = async () => {
    await NearbyModule.startDiscovering(invoked => {
      console.log('discoveredEndpoints: ', invoked);
      setInitTest(true);
      initTx();
    });
    // console.log('started discovering');
    // NearbyModule.startDiscovering(currentTimes => {
    //   const [currentTimeFound, currentTimeAcceptConnection, diffInSeconds] =
    //     currentTimes.split(',');
    //   console.log('All the output: ', currentTimes);
    //   console.log('Current Time Found: ', currentTimeFound);
    //   console.log(
    //     'Current Time Accept Connection: ',
    //     currentTimeAcceptConnection,
    //   );
    //   console.log('Current Time Found: ', diffInSeconds);
    // });
  };
  const initTx = () => {
    console.log('device detected');
  };
  const startAdvertising = async () => {
    await NearbyModule.startAdvertising();
  };
  const showDiscovered = () => {
    // InitEncounterTx(account);
    // NearbyModule.getDiscoveredEndpoints(invoked => {
    //   console.log('discoveredEndpoints: ', invoked);
    //   // setDiscoveredEndpoints(invoked);
    // });
  };
  const stopAdvertising = () => {
    NearbyModule.stopAdvertising();
  };
  const stopDiscovering = () => {
    NearbyModule.stopDiscovering();
  };

  const connectEndpoint = endpoint => {
    NearbyModule.connectToEndpoint(endpoint);
  };
  const getConnectedAccount = () => {
    const accounte = getAccount(wagmiConfig);
    console.log('connected account', accounte.address);
    setAccount(accounte.address);
  };

  if (Platform.OS === 'android' && Platform.Version >= 23) {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
    ).then(result => {
      if (result) {
        console.log('Permission is OK' + Platform.Version);
      } else {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]).then(results => {
          if (results) {
            console.log('User accepted');
          } else {
            console.log('User refused');
          }
        });
      }
    });
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <View style={styles.container}>
        <W3mButton balance="show" />
        <ContractConnect />
        <Web3Modal />
        {/* <Text>App</Text>
        <Text>Hello </Text>
        <Text>
          {account
            ? 'connected account::' +
              account.substr(0, 4) +
              '...' +
              account.substr(37, 42)
            : 'No account connected'}
        </Text> */}
        {/* <Button
          title="Click to start DIscovering"
          color="#841584"
          onPress={startDiscovering}
        /> */}
        <Button
          title="Start advertising!"
          color="#841584"
          onPress={startAdvertising}
        />
        {account ? <InitEncounterTx addresse={account} /> : <></>}
        {/* <Button
          title="Init encounter Tx"
          color="#841584"
          onPress={showDiscovered}
        /> */}
        {/* {discoveredEndpoints.map((endpoint, index) => (
          <View key={index}>
            <Text>{endpoint}</Text>
            <Button title="Connect" onPress={() => connectEndpoint(endpoint)} />
          </View>
        ))} */}
        <Button
          title="Stop discovering!"
          color="#841584"
          onPress={stopDiscovering}
        />
        <Button
          title="Stop Advertising!"
          color="#841584"
          onPress={stopAdvertising}
        />
        {/* <Button
          title="get connected account!"
          color="#841584"
          onPress={getConnectedAccount}
        /> */}
      </View>
    </WagmiConfig>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
