# main.py

import datetime
import os
import sys
import traceback

from convert import convert_to_beautiful_md
from fetch_emails import get_llm_ready_emails, load_config
from generate_report import generate_json_reports


def main():
    try:
        # Load configuration
        print("Loading configuration...")
        config = load_config()
        if not config:
            print("Error: Cannot load configuration. Check config.yaml file")
            return False
        
        # Default chunk size
        max_chunk_size = 15000
        
        # Calculate yesterday's date for default processing
        yesterday = datetime.date.today() - datetime.timedelta(days=1)
        date_str = yesterday.strftime('%Y%m%d')
        
        # Default base path - can be overridden in config
        base_path = config.get('storage', {}).get('base_path', date_str)
        
        # Allow for date formatting in the base_path if it contains formatting placeholders
        if '{date}' in base_path:
            base_path = base_path.format(date=date_str)
        
        # Command line args parsing
        if len(sys.argv) > 1:
            # First argument could be either chunk size or base path
            arg = sys.argv[1]
            try:
                # Try to parse as chunk size (integer)
                max_chunk_size = int(arg)
                print(f"Using custom chunk size: {max_chunk_size}")
                
                # If there's a second argument, it's the base path
                if len(sys.argv) > 2:
                    base_path = sys.argv[2]
                    print(f"Using custom base path: {base_path}")
            except ValueError:
                # Not an integer, so it must be the base path
                base_path = arg
                print(f"Using custom base path: {base_path}")
        
        print(f"Using base path: {base_path}")
        
        # Create base directory if it doesn't exist
        os.makedirs(base_path, exist_ok=True)
        
        # Execute the main functions - with error handling for each step
        print("\n=== STEP 1: LOADING AND PROCESSING EMAILS ===")
        try:
            result = get_llm_ready_emails(config, max_chunk_size, base_path=base_path)
            if result is False:  # Assuming the function returns False on error
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
            print(f"Email processing pipeline completed - Markdown file: {md_file}")
        except Exception as e:
            print(f"Error creating markdown file: {str(e)}")
            traceback.print_exc()
            return False
            
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
