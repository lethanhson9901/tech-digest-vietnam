import firebase_admin
from firebase_admin import credentials, storage


def list_firebase_buckets():
    """List all accessible Firebase Storage buckets for this service account"""
    try:
        # Initialize Firebase app with default config (no bucket specified)
        if not firebase_admin._apps:
            cred = credentials.Certificate('serviceAccountKey.json')
            firebase_admin.initialize_app(cred)
            print("Firebase app initialized successfully")
        
        # List all buckets
        client = storage.storage.Client()
        buckets = client.list_buckets()
        
        print("\nAccessible buckets:")
        bucket_count = 0
        for bucket in buckets:
            print(f"- {bucket.name}")
            bucket_count += 1
        
        if bucket_count == 0:
            print("No buckets found. You may need to create a bucket in Firebase Storage.")
        
        return True
    except Exception as e:
        print(f"Error listing Firebase buckets: {str(e)}")
        return False

if __name__ == "__main__":
    list_firebase_buckets()
