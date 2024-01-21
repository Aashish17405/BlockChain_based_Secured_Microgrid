import requests
import json
import time
from cryptography.fernet import Fernet


stored_value=0.2
generator_cost=0.2

with open('key.key', 'rb') as key_file:
    key = key_file.read()

cipher_suite = Fernet(key)

def encrypt_message(message):
    return cipher_suite.encrypt(message.encode()).decode()

def decrypt_message(encrypted_message):
    return cipher_suite.decrypt(encrypted_message.encode()).decode()

smart_controller_url = 'http://127.0.0.1:5005'
step = 0

def get_stored_value_from_login():
    try:
        response = requests.get('http://127.0.0.1:5000/get_stored_value')
        if response.status_code == 200:
            stored_value = response.json().get('stored_value')
            if stored_value==0:
                stored_value=generator_cost
            return stored_value
        else:
            print("Failed to retrieve stored value. Status code:", response.status_code)
    except Exception as e:
        print("Error:", e)

while step < 24:
    stored_value = get_stored_value_from_login()

    if stored_value is not None:
        print("Stored value retrieved from toplevel:", stored_value)
    else:
        print("Stored value retrieval failed or not found.")
        stored_value = 0.2

    encrypted_data = encrypt_message(json.dumps({"component_id": "generator", "generator_cost": stored_value}))

    requests.post(f'{smart_controller_url}/update_data', json={'encrypted_data': encrypted_data})
    time.sleep(10)

    response = requests.get(f'{smart_controller_url}/generator_response')
    encrypted_response = response.json().get('encrypted_data', '')

    decrypted_response = decrypt_message(encrypted_response)
    energy_management_data = json.loads(decrypted_response)

    print("Generator Energy Used:", energy_management_data.get('generator_energy_used', 'Not available'))

    from web3 import Web3
    import json
    from web3.middleware import geth_poa_middleware

    w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    w3.eth.default_account = "0xe630726A22167a2bE6Bc87beea5a493B91897093"
    abi = json.loads('[{"inputs":[{"internalType":"string","name":"element","type":"string"}],"name":"battery","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"battery_data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"element","type":"string"}],"name":"genset","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"genset_data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"element","type":"string"}],"name":"grid","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"grid_data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"element","type":"string"}],"name":"load","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"load_data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"element","type":"string"}],"name":"renewable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"renewable_data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"show_battery","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"show_genset","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"show_grid","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"show_load","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"show_renewable","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"}]')
    address = Web3.to_checksum_address("0x0754Cdfb3DcAE9E1d58bD2373833f65332075348")
    contract = w3.eth.contract(address=address,abi=abi)

    
    tx_hash = contract.functions.genset(str(stored_value)).transact({'from': w3.eth.default_account})

    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    print("BlockNumber:",tx_receipt['blockNumber'])

    call2=contract.functions.show_genset().call()
    print(len(call2))
    step += 1   
    time.sleep(30)