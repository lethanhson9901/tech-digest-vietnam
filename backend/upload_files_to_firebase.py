import os
from datetime import datetime

import firebase_admin
from firebase_admin import credentials, storage


def upload_to_firebase(file_path):
    """
    Upload the generated markdown file to Firebase Storage.
    
    Args:
        file_path (str): Path to the markdown file to be uploaded
    
    Returns:
        str: Public URL of the uploaded file, or None if upload fails
    """
    # Check if Firebase app is already initialized
    if not firebase_admin._apps:
        try:
            # Initialize Firebase app
            cred = credentials.Certificate('serviceAccountKey.json')
            
            # Make sure this matches your actual Firebase Storage bucket name
            # It should be in the format: project-id.appspot.com
            firebase_admin.initialize_app(cred, {
                'storageBucket': 'tech-digest-vietnam.appspot.com'
            })
            print("Firebase app initialized successfully")
        except Exception as e:
            print(f"Error initializing Firebase app: {str(e)}")
            return None

    # Get a reference to the storage service
    try:
        bucket = storage.bucket()
        print(f"Connected to bucket: {bucket.name}")
    except Exception as e:
        print(f"Error connecting to storage bucket: {str(e)}")
        return None

    try:
        # Get the filename from the file path
        file_name = os.path.basename(file_path)

        # Determine the appropriate folder based on file extension
        if file_name.endswith('.md'):
            folder = "reports"
        elif file_name.endswith('.json'):
            folder = "json_reports"
        else:
            folder = "other"

        # Create a new blob and upload the file's content
        blob = bucket.blob(f"{folder}/{file_name}")
        blob.upload_from_filename(file_path)

        # Make the blob publicly accessible
        blob.make_public()

        print(f"File {file_name} uploaded to Firebase Storage in {folder} folder successfully.")
        return blob.public_url
    except Exception as e:
        print(f"Error uploading file to Firebase Storage: {str(e)}")
        return None


def upload_directory_to_firebase(directory_path):
    """
    Upload all files in a directory to Firebase Storage.
    
    Args:
        directory_path (str): Path to the directory containing files to upload
    
    Returns:
        dict: Dictionary of filenames and their public URLs
    """
    uploaded_files = {}

    for root, dirs, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            public_url = upload_to_firebase(file_path)
            if public_url:
                uploaded_files[file] = public_url

    return uploaded_files
