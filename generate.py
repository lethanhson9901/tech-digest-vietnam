import json
import multiprocessing
import os
import time
from functools import partial
from pathlib import Path
from typing import Any, Dict

from gemini_handler import GeminiHandler

# Define your schema
report_schema: Dict[str, Any] = {
    "type": "object",
    "properties": {
        "from": {"type": "string", "description": "Nguồn gốc hoặc người gửi báo cáo"},
        "reportTitle": {"type": "string", "description": "Tiêu đề của báo cáo tin tức"},
        "sections": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "Tiêu đề của mục tin tức"},
                    "articles": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "headline": {"type": "string", "description": "Tiêu đề của bài báo"},
                                "summary": {"type": "string", "description": "Tóm tắt nội dung bài báo"},
                                "source": {"type": "string", "description": "Nguồn của bài báo"},
                                "link": {"type": "string", "description": "Đường dẫn đến bài báo gốc"}
                            },
                            "required": ["headline", "summary", "source", "link"]
                        }
                    }
                },
                "required": ["title", "articles"]
            }
        }
    },
    "required": ["from", "reportTitle", "sections"]
}

# Define your system prompt
system_instruction = """Chuyển nội dung email sau thành bài report tiếng Việt để tổng hợp thông tin một cách tự nhiên, hấp dẫn, đầy đủ, rõ ràng, trọng tâm. Có dẫn nguồn (link) nếu tôi muốn đọc chi tiết. Đây là nội dung email cần chuyển đổi:"""

# Function to read prompt from text file
def read_prompt_from_file(file_path: str) -> str:
    """Read prompt content from a text file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        raise Exception(f"Error reading file {file_path}: {str(e)}")

# Function to load config and determine process count
def get_process_count(config_path="config.yaml"):
    import yaml
    try:
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
            if config and 'gemini' in config and 'api_keys' in config['gemini']:
                api_keys_count = len(config['gemini']['api_keys'])
                return max(1, api_keys_count // 2)  # Ensure at least 1 process
    except Exception as e:
        print(f"Warning: Failed to load config from {config_path}: {e}")
    return 2  # Default to 2 processes if config can't be loaded

# Function to process a single file
def process_file(filename, input_dir, output_dir, config_path, system_instruction):
    input_path = os.path.join(input_dir, filename)
    output_filename = f"{os.path.splitext(filename)[0]}.json"
    output_path = os.path.join(output_dir, output_filename)
    
    print(f"Processing file: {filename}")
    
    try:
        # Initialize handler for each process to avoid conflicts
        handler = GeminiHandler(
            config_path=config_path,
            system_instruction=system_instruction
        )
        
        # Read content from file
        email_content = read_prompt_from_file(input_path)
        
        # Generate structured content
        result = handler.generate_structured_content(
            prompt=email_content,
            schema=report_schema,
            model_name="gemini-1.5-pro"
        )
        
        # Save result to JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"  Success! Saved to {output_path}")
        return True
        
    except Exception as e:
        print(f"  Error processing {filename}: {str(e)}")
        
        # Save error to a log file
        with open(os.path.join(output_dir, f"{os.path.splitext(filename)[0]}_error.log"), 'w') as f:
            f.write(f"Error processing file: {str(e)}")
        return False

def main():
    # Input and output directories
    input_dir = "chunked_content_20250319"
    output_dir = "json_reports_20250319"
    config_path = "config.yaml"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get list of all txt files in input directory
    input_files = [f for f in os.listdir(input_dir) if f.endswith('.txt')]
    
    # Determine number of processes (half of API keys)
    num_processes = get_process_count(config_path)
    print(f"Starting processing with {num_processes} parallel processes")
    
    # Create processing pool
    with multiprocessing.Pool(processes=num_processes) as pool:
        # Create partial function with fixed arguments
        process_func = partial(
            process_file, 
            input_dir=input_dir, 
            output_dir=output_dir,
            config_path=config_path,
            system_instruction=system_instruction
        )
        
        # Map files to processes
        results = pool.map(process_func, input_files)
    
    # Summarize results
    success_count = sum(1 for r in results if r)
    print(f"Processing complete! Successfully generated {success_count}/{len(input_files)} report files in {output_dir}")

if __name__ == "__main__":
    multiprocessing.freeze_support()  # For Windows compatibility if using PyInstaller
    main()
