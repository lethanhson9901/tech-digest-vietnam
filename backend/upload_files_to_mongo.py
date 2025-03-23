import os
from datetime import datetime

import yaml
from pymongo import MongoClient
from pymongo.server_api import ServerApi


def connect_to_mongodb():
    """
    Connect to MongoDB using the URI from the config file.
    
    Returns:
        MongoClient: MongoDB client object, or None if connection fails
    """
    try:
        # Load the config.yaml file
        with open('config.yaml', 'r') as file:
            config = yaml.safe_load(file)

        # Get the MongoDB URI from the config
        uri = config['storage']['mongo_db_uri']

        # Create a new client and connect to the server
        client = MongoClient(uri, server_api=ServerApi('1'))

        # Send a ping to confirm a successful connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
        return None

def upload_to_mongodb(file_path):
    """
    Upload the content of a file to MongoDB.
    
    Args:
        file_path (str): Path to the file to be uploaded
    
    Returns:
        str: ID of the inserted document, or None if upload fails
    """
    client = connect_to_mongodb()
    if not client:
        return None
        
    try:
        # Get the filename from the file path
        file_name = os.path.basename(file_path)

        # Determine the appropriate collection based on file extension
        if file_name.endswith('.md'):
            collection = client.tech_digest.reports
        elif file_name.endswith('.json'):
            collection = client.tech_digest.json_reports
        else:
            collection = client.tech_digest.other

        # Read the file content
        with open(file_path, 'r') as file:
            content = file.read()

        # Create a document to insert
        document = {
            "filename": file_name,
            "content": content,
            "upload_date": datetime.utcnow()
        }

        # Insert the document
        result = collection.insert_one(document)

        print(f"File {file_name} uploaded to MongoDB successfully.")
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error uploading file to MongoDB: {str(e)}")
        return None
    finally:
        client.close()

def upload_directory_to_mongodb(directory_path):
    """
    Upload all files in a directory to MongoDB.
    
    Args:
        directory_path (str): Path to the directory containing files to upload
    
    Returns:
        dict: Dictionary of filenames and their MongoDB document IDs
    """
    client = connect_to_mongodb()
    if not client:
        return {}

    uploaded_files = {}

    try:
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                file_path = os.path.join(root, file)
                
                # Get the filename from the file path
                file_name = os.path.basename(file_path)

                # Determine the appropriate collection based on file extension
                if file_name.endswith('.md'):
                    collection = client.tech_digest.reports
                elif file_name.endswith('.json'):
                    collection = client.tech_digest.json_reports
                else:
                    collection = client.tech_digest.other

                # Read the file content
                with open(file_path, 'r') as f:
                    content = f.read()

                # Create a document to insert
                document = {
                    "filename": file_name,
                    "content": content,
                    "upload_date": datetime.utcnow()
                }

                # Insert the document
                result = collection.insert_one(document)
                document_id = str(result.inserted_id)
                
                if document_id:
                    uploaded_files[file] = document_id
                    print(f"File {file_name} uploaded to MongoDB successfully.")
    except Exception as e:
        print(f"Error uploading directory to MongoDB: {str(e)}")
    finally:
        client.close()
        
    return uploaded_files

# Example usage
if __name__ == "__main__":
    md_file = "/home/son/Documents/tech-digest-vietnam/data/20250319/tech_news_digest_20250319.md"
    uploaded_file = upload_to_mongodb(md_file)
    print("Uploaded file ID:", uploaded_file)
