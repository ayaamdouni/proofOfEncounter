import React from 'react';
import {Button} from 'react-native';
import {useContractWrite, usePrepareContractWrite} from 'wagmi';
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

const InitEncounterTx = ({addresse}) => {
  const {config} = usePrepareContractWrite({
    address: '0xAaC7Ba97A2a8A42284a777178a6BC5345fdf9069',
    abi: ContractABI,
    functionName: 'initEncounter',
    args: [addresse, '0x90', '2000'],
  });
  const {
    data: OutputInit,
    isLoading: InitisLoading,
    isSuccess: InitisSuccess,
    write: initEncounters,
  } = useContractWrite(config);
  const initEncounterT = () => {
    if (InitisLoading) {
      console.log('loading Tx');
    }
    if (InitisSuccess) {
      console.log('Success Tx');
    }
    initEncounters();
  };
  return <Button title="init encounter Tx" onPress={initEncounters} />;
};

export default InitEncounterTx;
