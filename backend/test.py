from pymongo import MongoClient

# Use your connection string from Atlas
uri = "mongodb+srv://lethanhson9901:WCUf7zMeNpxZhCl8@cluster0.wbloa.mongodb.net/?retryWrites=true&w=majority"

try:
    client = MongoClient(uri)
    db = client.admin
    result = db.command('ping')
    print("Connected successfully!", result)
except Exception as e:
    print(f"Error connecting: {e}")