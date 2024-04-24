import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, Button} from 'react-native';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import {NativeModules} from 'react-native';
const ContractABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'encounterIndex',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'deviceB',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'signedFEncounterID',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'aTimestamp',
        type: 'uint256',
      },
    ],
    name: 'finalizeEncounter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Index',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'deviceA',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'signedTEncounterID',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'bTimestamp',
        type: 'uint256',
      },
    ],
    name: 'initEncounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'encounters',
    outputs: [
      {
        internalType: 'address',
        name: 'deviceA',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'signedTEncounterID',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'bTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'deviceB',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'signedFEncounterID',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'aTimestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'encounterIndex',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'deviceB',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'aTimestamp',
        type: 'uint256',
      },
    ],
    name: 'retrieveFEncounterID',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'encounterIndex',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'deviceA',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'bTimestamp',
        type: 'uint256',
      },
    ],
    name: 'retrieveTEncounterID',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'word',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
const {NearbyModule} = NativeModules;

const ContractConnect = () => {
  const {
    data: encountersData,
    isError,
    isLoading,
    isSuccess,
  } = useContractRead({
    address: '0xAaC7Ba97A2a8A42284a777178a6BC5345fdf9069',
    abi: ContractABI,
    functionName: 'encounters',
    args: [0],
  });
  const {config} = usePrepareContractWrite({
    address: '0xAaC7Ba97A2a8A42284a777178a6BC5345fdf9069',
    abi: ContractABI,
    functionName: 'initEncounter',
    args: ['0xbfa25a6ff03b2a0edd94028d03acf4b3a1627e7f', '0x50', '1500'],
  });
  const {
    data: OutputInit,
    isLoading: InitisLoading,
    isSuccess: InitisSuccess,
    write: initEncounters,
  } = useContractWrite(config);

  const connectSmartContract = async () => {
    await NearbyModule.startDiscovering(invoked => {
      console.log('discoveredEndpoints: ', invoked);
      initEncounters();
      console.log('TX.....');
    });
  };
  const showDiscovered = () => {
    NearbyModule.startDiscovering(invoked => {
      console.log(
        'discoveredEndpoints: ',
        invoked,
        'data from smart contract',
        encountersData,
      );
    });
  };
  const retrieveFEncounterID = () => {
    // console.log('returned data', retrieveFEncounterIDData);
  };
  return (
    <View>
      <Button title="start discovering" onPress={connectSmartContract} />
      {/* <Button title="init Encounter" onPress={initEncounters} />
      <Button title="retrieveTEncounterID" onPress={showDiscovered} />
      <Button title="get connected address" onPress={retrieveFEncounterID} /> */}
    </View>
  );
};

export default ContractConnect;
