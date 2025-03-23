# main.py

import argparse
import datetime
import os
import sys
import traceback

from cleanup import cleanup_files
from convert import convert_to_beautiful_md
from fetch_emails import get_llm_ready_emails, load_config
from generate_report import generate_json_reports
from upload_files_to_mongo import upload_directory_to_mongodb, upload_to_mongodb


def main():
    try:
        # Set up argument parser
        parser = argparse.ArgumentParser(description="Process emails and generate reports.")
        parser.add_argument("--chunk-size", type=int, default=15000, help="Maximum chunk size for email processing")
        parser.add_argument("--base-path", type=str, help="Base path for storing data")
        parser.add_argument("--skip-upload", action="store_true", help="Skip uploading files to Firebase")
        args = parser.parse_args()

        # Load configuration
        print("Loading configuration...")
        config = load_config()
        if not config:
            print("Error: Cannot load configuration. Check config.yaml file")
            return False
        
        # Calculate yesterday's date for default processing
        yesterday = datetime.date.today() - datetime.timedelta(days=1)
        date_str = yesterday.strftime('%Y%m%d')
        
        # Use provided base path or default from config
        base_path = args.base_path or config.get('storage', {}).get('base_path', date_str)
        
        # Allow for date formatting in the base_path if it contains formatting placeholders
        if '{date}' in base_path:
            base_path = base_path.format(date=date_str)
        
        print(f"Using base path: {base_path}")
        print(f"Using chunk size: {args.chunk_size}")
        
        # Create base directory if it doesn't exist
        os.makedirs(base_path, exist_ok=True)
        
        # Execute the main functions - with error handling for each step
        print("\n=== STEP 1: LOADING AND PROCESSING EMAILS ===")
        try:
            result = get_llm_ready_emails(config, args.chunk_size, base_path=base_path)
            if result is False:
                print("Warning: Email processing did not complete, but continuing...")
        except Exception as e:
            print(f"Error processing emails: {str(e)}")
            traceback.print_exc()
            return False
        
        print("\n=== STEP 2: GENERATING JSON REPORTS BY USING LLM ===")
        try:
            success_count = generate_json_reports(
                date=yesterday, 
                config_path="config.yaml", 
                base_path=base_path
            )
            if success_count == 0:
                print("Warning: No JSON files were created, check previous steps...")
                return False
            print(f"Successfully created {success_count} JSON files")
        except Exception as e:
            print(f"Error generating JSON reports: {str(e)}")
            traceback.print_exc()
            return False
        
        print("\n=== STEP 3: CREATING MARKDOWN FILE ===")
        try:
            md_file = convert_to_beautiful_md(date=yesterday, base_path=base_path)
            if not md_file:
                print("Error: Could not create markdown file")
                return False
            print(f"Markdown file created: {md_file}")
        except Exception as e:
            print(f"Error creating markdown file: {str(e)}")
            traceback.print_exc()
            return False

        if not args.skip_upload:
            print("\n=== STEP 4: UPLOADING FILES TO FIREBASE ===")
            try:
                # Upload markdown file
                md_firebase_url = upload_to_mongodb(md_file)
                if md_firebase_url:
                    print(f"Markdown file uploaded successfully. Public URL: {md_firebase_url}")
                else:
                    print("Failed to upload markdown file to Firebase.")

                # Upload JSON files
                json_dir = os.path.join(base_path, "json_reports")
                json_upload_results = upload_directory_to_mongodb(json_dir)
                for file, url in json_upload_results.items():
                    if url:
                        print(f"JSON file {file} uploaded successfully. Public URL: {url}")
                    else:
                        print(f"Failed to upload JSON file {file} to Firebase.")

                print("\n=== STEP 5: CLEANING UP ===")
                cleanup_files(base_path, keep_markdown=False, keep_json=False)
                print("All temporary files removed after successful Firebase upload.")
            except Exception as e:
                print(f"Error during upload or cleanup: {str(e)}")
                traceback.print_exc()
        else:
            print("\n=== STEP 4: SKIPPING UPLOAD TO FIREBASE ===")
            print("Files will be kept locally as requested.")

        return True
        
    except Exception as e:
        print(f"Unidentified error in the process: {str(e)}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ The entire process completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Process did not complete due to errors!")
        sys.exit(1)
