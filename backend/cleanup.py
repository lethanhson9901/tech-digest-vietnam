# cleanup.py

import os
import shutil


def cleanup_files(base_path, keep_markdown=True, keep_json=True):
    """
    Clean up files after processing, keeping only the specified files.
    
    Args:
        base_path (str): Base directory path containing the files
        keep_markdown (bool): Whether to keep the final markdown file
        keep_json (bool): Whether to keep the JSON folder
    """
    try:
        # Keep the markdown file if specified
        if keep_markdown:
            markdown_file = next((f for f in os.listdir(base_path) if f.endswith('.md')), None)
            if markdown_file:
                print(f"Keeping markdown file: {markdown_file}")
            else:
                print("No markdown file found to keep.")
        
        # Keep the JSON folder if specified
        json_folder = os.path.join(base_path, "json_reports")
        if keep_json and os.path.exists(json_folder):
            print(f"Keeping JSON folder: {json_folder}")
        
        # Remove other files and folders
        for item in os.listdir(base_path):
            item_path = os.path.join(base_path, item)
            if os.path.isfile(item_path):
                if keep_markdown and item.endswith('.md'):
                    continue
                os.remove(item_path)
                print(f"Removed file: {item}")
            elif os.path.isdir(item_path):
                if keep_json and item == "json_reports":
                    continue
                shutil.rmtree(item_path)
                print(f"Removed directory: {item}")
        
        print("Cleanup completed successfully.")
    except Exception as e:
        print(f"Error during cleanup: {str(e)}")

