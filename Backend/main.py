from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token,jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import secrets,pytz

bcrypt = Bcrypt()
app = Flask(__name__)
CORS(app)


from twilio.rest import Client
import random
account_sid = 'AC7aee436a54cac70e58bde33a0015bfc3'
auth_token = 'fc2d67d6270513853d88d86419943df1'
twilio_phone_number = '+16174407457'
client = Client(account_sid, auth_token)
otp=0
def generate_otp():
    otp=''.join([str(random.randint(0, 9)) for _ in range(6)])
    return otp  # Generating a 6-digit OTP

@app.route('/send_otp', methods=['POST'])
def send_otp():
    global otp
    mobile_number = '+919381150341'
    
    if not mobile_number:
        return jsonify({'message': 'Mobile number is required'}), 400

    otp = generate_otp()
   
    # Send OTP using Twilio
    try:
        message = client.messages.create(
            body=f'Your OTP is: {otp}',
            from_=twilio_phone_number,
            to=mobile_number
        )
        return jsonify({'message': 'OTP sent successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to send OTP', 'error': str(e)}), 500

# Endpoint to verify OTP
@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    user_otp = request.json.get('otp')
    if user_otp == otp:
        return jsonify({'message': 'OTP verified successfully'}), 200
    else:
        return jsonify({'message': 'Invalid OTP'}), 401
    
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
secret_key = secrets.token_urlsafe(32)
app.config['JWT_SECRET_KEY'] = secret_key
mclient = MongoClient('mongodb://localhost:27017/')
db = mclient['PS']
indian_timezone = pytz.timezone('Asia/Kolkata')
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    latitude = request.json.get('latitude')
    longitude = request.json.get('longitude')

    incorrect_users = db['incorrect_users']
    user_agent = request.headers.get('User-Agent')
    now = datetime.now()
    ip_address = request.remote_addr
    user_agent1 = get_user_agent_info(user_agent)

    collections = ['toplevel', 'consumers', 'middleman']
    for collection_name in collections:
        users_collection = db[collection_name]
        user = users_collection.find_one({'username': username})
        if user and bcrypt.check_password_hash(user['password'], password):
            access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
            correct_users = db['correct_users']
            correct_user_data = {'ip address':ip_address,'username': username,'useragent': f'Logged in through {get_user_agent_info(user_agent)}','login_time':now,'Latitude':latitude,'Longitude':longitude}
            correct_users.insert_one(correct_user_data)
            # incorrect_users.delete_one({'ip_address': request.remote_addr})
            return jsonify({'message': 'Login successful!','redirect_url': f'/{collection_name}','access_token': access_token,'role': f'{collection_name}'}), 200

    new_attempt = {'username': username ,'useragent': f'Tried to log in using {user_agent1}','attempt_time': now,'Latitude':latitude,'Longitude':longitude}
    existing_document = incorrect_users.find_one({'ip_address': ip_address})
    if existing_document:
        incorrect_users.update_one(
            {'ip_address': ip_address},
            {'$push': {'attempts': new_attempt}}
        )
    else:
        incorrect_users.insert_one({'ip_address': ip_address, 'attempts': [new_attempt]})


    incorrect_user = incorrect_users.find_one({'ip_address':ip_address})
    now = datetime.now()

    if incorrect_user and len(incorrect_user['attempts']) >= 3:
        time_difference = now - incorrect_user['attempts'][-3]['attempt_time']
        
        if time_difference <= timedelta(seconds=30):
            return jsonify({'message': 'Locked due to too many failed attempts. Please try again in 30 seconds.'}), 429
    
    return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    current_user = get_jwt_identity()
    latitude = request.json.get('latitude')
    longitude = request.json.get('longitude')
    logout_time = request.json.get('logoutTime')

    correct_users = db['correct_users']
    user_data = correct_users.find_one({'username': current_user})
    
    if user_data:
        # Update user data with logout information
        user_data['latitude'] = latitude
        user_data['longitude'] = longitude
        user_data['logout_time'] = logout_time
        correct_users.update_one({'username': current_user}, {'$set': user_data})

        return jsonify({'message': 'Logout successful!'}), 200
    else:
        return jsonify({'message': 'User not found.'}), 404

def get_user_agent_info(user_agent):
    if 'Edg' in user_agent:
        return 'Microsoft Edge.'
    elif 'Brave' in user_agent:
        return 'Brave browser.'
    elif 'Chrome' in user_agent:
        return 'Google Chrome.'
    elif 'Firefox' in user_agent:
        return 'Mozilla Firefox.'
    elif 'Safari' in user_agent and 'Chrome' not in user_agent:
        return 'Safari.'
    else:
        return 'an unknown browser.'

@app.route('/register', methods=["POST"])
def register():
    data = request.json
    if not data or 'username' not in data or 'password' not in data or 'userType' not in data:
        return jsonify({'error': 'Invalid request'}), 400
    username = data['username']
    password = data['password']
    user_type = data['userType']
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users_collection = db[user_type]
    users_collection.insert_one({
        'username': username,
        'password': hashed_password
    })
    print("Data addition successful")
    return jsonify({'message': 'Successfully registered new user'}), 200

@app.route('/api/add-feedback', methods=['POST'])
def add_data():
    db = mclient['PS']  
    collection = db['feedback'] 
    data = request.json 
    try:
        collection.insert_one(data)
        return jsonify({'message': 'Data added to MongoDB successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/protected', methods=['GET'])
def protected():
    jwt_username = request.jwt_identity
    return jsonify(logged_in_as=jwt_username), 200

stored_value=0
@app.route('/organization', methods=['POST'])
def update_organization():
    try:
        global stored_value
        data = request.json  # Get the data sent from the frontend
        input_value = data.get('data')  # Extract the input value
        stored_value = input_value
        print(f"Received value from frontend: {stored_value}")

        # Return a response if needed
        return {'message': 'Data received on Flask successfully'}, 200
    except Exception as e:
        return {'error': str(e)}, 500
    

@app.route('/get_stored_value', methods=['GET'])
def get_stored_value():
    global stored_value  # Access the global variable
    
    try:
        return {'stored_value': stored_value}, 200
    except Exception as e:
        return {'error': str(e)}, 500

def update_stored_value(new_value):
    global stored_value  # Access the global variable
    stored_value = new_value
    print(f"Stored value updated to: {stored_value}")


@app.route('/api/add-time', methods=['POST'])
def add_time():
    try:
        data = request.json
        time = data.get('time')  
        print(f"Selected time: {time} hours")
        return jsonify({'message': 'Data received on Flask successfully', 'time': time}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# from web3 import Web3
# import json
# from web3.middleware import geth_poa_middleware

# # Create an instance of the Web3 class
# w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
# # Add the Geth PoA middleware
# w3.middleware_onion.inject(geth_poa_middleware, layer=0)
# # Set the default account
# w3.eth.default_account = "0xe630726A22167a2bE6Bc87beea5a493B91897093"
# abi = json.loads('[{"inputs":[{"internalType":"string","name":"element","type":"string"}],"name":"battery","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"battery_data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"element","type":"string"}],"name":"genset","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"genset_data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"element","type":"string"}],"name":"grid","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"grid_data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"element","type":"string"}],"name":"load","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"load_data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"element","type":"string"}],"name":"renewable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"renewable_data","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"show_battery","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"show_genset","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"show_grid","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"show_load","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"show_renewable","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"}]')
# address = Web3.to_checksum_address("0x0754Cdfb3DcAE9E1d58bD2373833f65332075348")
# contract = w3.eth.contract(address=address,abi=abi)


# from flask import send_file
# import matplotlib.pyplot as plt
# import io


# @app.route('/generate_bar_graph')
# def generate_bar_graph():
#     call=contract.functions.show_load().call()
#     for i in range(len(call)):
#         call[i]=int(call[i])
#     # print(call)
#     time_array=call
#     start = len(time_array) - (24 * 16)
#     if start < 0:
#         start = 0

#     day_wise_load = []
#     s = start
#     for i in range(start, len(time_array)):
#         if (i - start) % 24 == 0 and i != start:
#             daily_sum = sum(time_array[s:i])
#             day_wise_load.append(daily_sum)
#             s = i
    
#     x_labels = list(range(1, len(day_wise_load) + 1))
#     plt.xlabel('Days')
#     plt.ylabel('Load')
#     plt.ylim(5000,9000)
#     for i, v in enumerate(day_wise_load):
#         plt.text(i + 1, v + 100, str(v), ha='center', va='bottom')
#     plt.grid(axis='y', linestyle='--', alpha=0.7)
#     plt.xticks(range(1, len(day_wise_load) + 1), x_labels)
#     plt.gca().spines['right'].set_visible(False)
#     plt.gca().spines['top'].set_visible(False)
#     bar_width = 0.6
#     # plt.figure(figsize=(15, 3))
#     plt.bar(range(1,len(day_wise_load)+1), day_wise_load,width=bar_width)
    
#     buffer = io.BytesIO()
#     plt.savefig(buffer, format='png')
#     buffer.seek(0)
#     plt.close()
#     return send_file(buffer, mimetype='image/png')


# from datetime import datetime, timedelta
# @app.route('/get_table_data')
# def get_table_data():
#     headers = ['Days'] + [f'{i-1}:00 to {i}:00' for i in range(1, 25)] + ['Total Load']
#     table_data = [headers]
#     hour_data = contract.functions.show_load().call()
#     start = len(hour_data) - (24 * 15)
#     if start < 0:
#         start = 0
#     current_date = datetime.now()
#     days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

#     for day in range(start // 24 + 1, start // 24 + 16):
#         start_idx = (day - 1) * 24
#         end_idx = day * 24
#         row = [f'{days_of_week[current_date.weekday()]}'] + [int(value) for value in hour_data[start_idx:end_idx]]
#         row_sum = sum(row[1:])
#         row.append(row_sum)
#         table_data.append(row)
#         current_date -= timedelta(days=1)

#     return jsonify({'data': table_data})


# def generate_plot(x_data, y_data):
#     plt.figure() 
#     plt.plot(x_data, y_data)
#     plt.xlabel('X-axis')
#     plt.ylabel('Y-axis')

#     buffer = io.BytesIO()
#     plt.savefig(buffer, format='png')
#     buffer.seek(0)
#     plt.close() 
#     return send_file(buffer, mimetype='image/png')

# @app.route('/batterys')
# def generate_battery_plot():
#     a=contract.functions.show_battery().call()
#     time = request.args.get('time')
#     if time:
#         return generate_plot(range(0,len(a[0:int(time)])), a[0:int(time)])
#     return jsonify({'error': 'Invalid time parameter'}), 400

# @app.route('/generators')
# def generate_genset_plot():
#     a=contract.functions.show_genset().call()
#     time = request.args.get('time')
#     if time:
#         return generate_plot(range(0,len(a[0:int(time)])), a[0:int(time)])
#     return jsonify({'error': 'Invalid time parameter'}), 400


# @app.route('/renewable_source')
# def generate_renewable_plot():
#     a=contract.functions.show_renewable().call()
#     time = request.args.get('time')
#     result = []
#     for item in a:
#         start, end = item.split('-')
#         result.append(start) 

#     result = list(map(int, result))
#     if time:
#         return generate_plot(range(0,len(result[0:int(time)])), result[0:int(time)])
#     return jsonify({'error': 'Invalid time parameter'}), 400

# @app.route('/load')
# def generate_load_plot():
#     a=contract.functions.show_load().call()
#     time = request.args.get('time')
#     if time:
#         return generate_plot(range(0,len(a[0:int(time)])), a[0:int(time)])
#     return jsonify({'error': 'Invalid time parameter'}), 400

# @app.route('/grid')
# def generate_grid_plot():
#     a=contract.functions.show_grid().call()
#     time = request.args.get('time')
#     if time:
#         return generate_plot(range(0,len(a[0:int(time)])), a[0:int(time)])
#     return jsonify({'error': 'Invalid time parameter'}), 400

if __name__ == "__main__":
    app.run(debug=True)