
# Cyber security enabled smart control for grid connected microgrid

My innovation integrates a user-friendly website for seamless microgrid element access, a robust blockchain infrastructure for secure data storage and an advanced simulator to replicate and analyze the dynamic microgrid setup.


## Aim
Aim of the project is to develop a cybersecurity-enabled smart controller for grid- connected microgrids. The smart controller will play a crucial role in ensuring the secure and efficient operation of the microgrid by:

- Securing communication between the smart controller and other components within the microgrid using robust encryption protocols.

- Creating an access control mechanism to regulate user access based on roles and privileges.

- Developing a logging system to track all activities.

- Developing a user-friendly interface for the smart controller to enable efficient monitoring, configuration, and management of the microgrid's cybersecurity settings.

## Workflow
![Flow chart](lpg.png)

## Tech stack
React: Front-end framework

Flask: Back-end as a service

MongoDB: Database

I used python to simulate the microgrid setup and a private blockchain based on Go Ethereum for secure and decentralized data storage and transactions.



## Blockchain
I used a private blockchain based on Go-Ethereum for secure and 
decentralized data storage and transactions. These are the commands I used to create a blockchain using Go-Ethereum

To create the nodes
```bash
geth --datadir "./data" account new
```

To create bootnode
```bash
bootnode -genkey { NAME_OF_THE_KEY }.key
```
To start bootnode
```bash
bootnode -nodekey { KEY_NAME } -verbosity 7 -addr "127.0.0.1:30301"
```
To start Node1
```bash
geth --datadir "./data"  --port 30304 --bootnodes enode://{ YOUR_VALUE } --authrpc.port 8547 --ipcdisable --allow-insecure-unlock  --http --http.corsdomain="https://remix.ethereum.org" --http.api web3,eth,debug,personal,net --networkid { NETWORK_ID } --unlock { ADDRESS_NODE1 } --password { PASSWORD_FILE_NAME_EXTENSION }  --mine --miner.etherbase= { SIGNER_ADDRESS }
```

To start node2
```bash
geth --datadir "./data"  --port 30306 --bootnodes enode://{ YOUR_VALUE }  -authrpc.port 8546 --networkid { NETWORK_ID } --unlock { ADDRESS_NODE2 } --password { PASSWORD_FILE_WITH_EXTENSION }
```
The components within the microgrid ecosystem dynamically engage with the smart contract embedded in the blockchain, facilitating secure and transparent transactions to persistently store data. This mechanism ensures the integrity of the stored information, guarding against any potential tampering or unauthorized alterations. The interaction is made using the [web3.py](https://web3py.readthedocs.io/en/stable/) python library.

## Simulator
I used python to simulate the microgrid setup. To mimic a smartcontroller of a microgrid, I used a flask server which takes inputs and sends the commands to the elements of the microgrid.All microgrid communication with the smart controller is secured through encryption, implemented using the [cryptography.fernet](https://cryptography.io/en/latest/fernet/) Python library. A key is used to create a "Fernet" cipher suite. There are functions encrypt_message and decrypt_message that use the cipher suite to encrypt and decrypt messages, respectively. Fernet is a simple symmetric encryption algorithm that provides a high level of security and is suitable for encrypting small pieces of data, such as tokens or messages. Important info about the performance of the elements is stored in the blockchain so that this info can't be tampered. To get this functionality I used [web3.py](https://web3py.readthedocs.io/en/stable/) Python library. [web3.py](https://web3py.readthedocs.io/en/stable/) allows us to interact with the Ethereum blockchain and build applications that leverage blockchain functionalities. 