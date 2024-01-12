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


app.run(debug=True)