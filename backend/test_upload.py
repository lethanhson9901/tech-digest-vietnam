import os
import sys
from datetime import datetime

# Import the upload functions
from upload_files_to_firebase import upload_directory_to_firebase, upload_to_firebase


def test_upload():
    """
    Test the Firebase upload functionality by uploading a file or directory
    """
    print("Firebase Upload Test")
    print("===================")
    
    # Check if a path argument was provided
    if len(sys.argv) < 2:
        print("Usage: python test_upload.py <file_path_or_directory>")
        print("Example: python test_upload.py ./reports/report.md")
        print("Example: python test_upload.py ./reports/")
        return
    
    path = sys.argv[1]
    
    # Check if the path exists
    if not os.path.exists(path):
        print(f"Error: Path '{path}' does not exist")
        return
    
    # Determine if it's a file or directory
    if os.path.isfile(path):
        print(f"Uploading file: {path}")
        url = upload_to_firebase(path)
        if url:
            print(f"Upload successful!")
            print(f"Public URL: {url}")
        else:
            print("Upload failed!")
    
    elif os.path.isdir(path):
        print(f"Uploading all files from directory: {path}")
        uploaded_files = upload_directory_to_firebase(path)
        
        if uploaded_files:
            print(f"\nSuccessfully uploaded {len(uploaded_files)} files:")
            for filename, url in uploaded_files.items():
                print(f"- {filename}: {url}")
        else:
            print("No files were uploaded successfully.")
    
    else:
        print(f"Error: Path '{path}' is neither a file nor a directory")

if __name__ == "__main__":
    test_upload()