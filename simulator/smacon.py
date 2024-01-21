from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
import json

app = Flask(__name__)
CORS(app)
# Placeholder values for initial data
solar_energy_production = 0
load_demand = 0
battery_soc = 0
grid_cost = 0
generator_cost = 0
solar_energy_used=0
grid_energy_used=0
generator_energy_used=0
battery_energy_used=0
load_cost=0
battery_charging=0
excess_solar_energy=0
a=0
b=0
c=0
d=0
e=0
f=0
g=0
h=10

with open('key.key', 'rb') as key_file:
    key = key_file.read()

cipher_suite = Fernet(key)

# Encrypt message function
def encrypt_message(message):
    return cipher_suite.encrypt(message.encode()).decode()

def decrypt_message(encrypted_message):
    return cipher_suite.decrypt(encrypted_message.encode()).decode()

@app.route('/update_data', methods=['POST'])
def update_data():
    global solar_energy_production, load_demand, battery_soc, grid_cost, generator_cost
    data = request.json
    encrypted_data = data.get('encrypted_data', '')
     
    # Decrypt the received encrypted data
    decrypted_data = decrypt_message(encrypted_data)
    component_id = json.loads(decrypted_data).get('component_id')
    if component_id is None:
        return jsonify({"status": "error", "message": "Component ID not provided"})

    # Update data based on the component ID
    if component_id == "solar":
        solar_energy_production=json.loads(decrypted_data).get('solar_energy_production')
    elif component_id == 'load':
        load_demand = json.loads(decrypted_data).get('load_demand')
    elif component_id == 'battery':
        battery_soc = json.loads(decrypted_data).get('battery_soc')
    elif component_id == 'grid':
        grid_cost = json.loads(decrypted_data).get('grid_cost')
    elif component_id == 'generator':
        generator_cost = json.loads(decrypted_data).get('generator_cost')
    else:
        return jsonify({"status": "error", "message": "Invalid component ID"})

    return jsonify({"status": "success"})

@app.route('/energy_management', methods=['GET'])
def energy_management():
    global solar_energy_production, load_demand, battery_soc, grid_cost, generator_cost,excess_solar_energy
    global solar_energy_used ,grid_energy_used,generator_energy_used,load_cost,battery_charging,battery_energy_used
    global a ,b,c,d,e,f,g,h
    if (load_demand<=solar_energy_production):
        load_cost=str(3*load_demand)
        c=load_cost
        solar_energy_used=load_demand
        solar_energy_production=solar_energy_production-solar_energy_used
        a=solar_energy_used 
        if solar_energy_production>0 and battery_soc<100:
            battery_charging=min(solar_energy_production,100-battery_soc)
            solar_energy_production=solar_energy_production-battery_charging 
            f=battery_charging 
        else:
            f=0
        if solar_energy_production>0:
            excess_solar_energy=solar_energy_production 
            g=excess_solar_energy 
        else:
            g=0
        b=0
        d=0
        e=0

    else:
        solar_energy_used=solar_energy_production 
        load_demand=load_demand-solar_energy_used 
        a=solar_energy_used
        if battery_soc>10 and battery_soc<=100:
            load_demand=load_demand-(battery_soc)
            battery_energy_used=min(load_demand,battery_soc)
            e=battery_energy_used 
        else:
            e=0
        if load_demand>0:
            if grid_cost < generator_cost:
                load_cost=grid_cost*load_demand + a*3
                grid_energy_used=load_demand
                b=grid_energy_used
                c=load_cost
                d=0
            else:
                load_cost=generator_cost*load_demand + a*3
                generator_energy_used=load_demand 
                d=generator_energy_used
                generator_energy_used=0
                c=load_cost 
                b=0
        f=0
        g=0
    grid_energy_used=0
    solar_energy_used=0
    load_cost=0
    battery_energy_used=0
    battery_charging=0
    generator_energy_used=0
    excess_solar_energy=0

@app.route('/solar_response', methods=['GET'])
def solar_response():
    energy_management() 
    encrypted_data = encrypt_message(json.dumps({
        "solar_energy_used": a
    }))
    return jsonify({"encrypted_data": encrypted_data})

@app.route('/grid_response', methods=['GET'])
def grid_response():
    # Encrypt the response data before sending
    encrypted_data = encrypt_message(json.dumps({
        "grid_energy_used": b,
        "excess_solar_energy": g
    }))
    return jsonify({"encrypted_data": encrypted_data})

@app.route('/load_response', methods=['GET'])
def load_response():
    encrypted_data = encrypt_message(json.dumps({
        "load_cost": c,
    }))
    return jsonify({"encrypted_data": encrypted_data}) 

@app.route('/generator_response', methods=['GET'])
def generator_response():
    encrypted_data = encrypt_message(json.dumps({
        "generator_energy_used": d,
    }))
    return jsonify({"encrypted_data": encrypted_data})

@app.route('/battery_response', methods=['GET'])
def battery_response():
    global e, f  # Assuming 'e' and 'f' are the battery energy used and charging
    encrypted_data = encrypt_message(json.dumps({
        "battery_energy_used": e,
        "battery_charging": f
    }))
    return jsonify({"encrypted_data": encrypted_data})

@app.route('/gen_cost', methods=['GET'])
def gen_cost():
    print("gen cost:",generator_cost)
    return  jsonify(generator_cost)

@app.route('/bill', methods=['GET'])
def billAmount():
    global c
    return  jsonify(c)
if __name__ == '__main__':
    app.run(port=5005,debug=True)