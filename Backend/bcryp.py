import bcrypt
from pymongo import MongoClient

string_to_hash = "1234"
hashed_string = bcrypt.hashpw(string_to_hash.encode('utf-8'), bcrypt.gensalt())
print("Hashed String:", hashed_string.decode('utf-8'))

client = MongoClient('mongodb://localhost:27017/')
db = client['PS']
users_collection = db['toplevel']

# Store the username and hashed password in MongoDB
users_collection.insert_one({
    'username': "toplevel",
    'password': hashed_string.decode('utf-8')  # Decode the bytes to store as string
})
print("Data addition succesful")