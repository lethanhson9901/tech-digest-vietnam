import datetime
import json
import multiprocessing
import os
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
from typing import Any, Dict, List, Tuple

import yaml

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
system_instruction = """Chuyển nội dung email sau thành bài report tiếng Việt để tổng hợp thông tin một cách tự nhiên, hấp dẫn, đầy đủ, rõ ràng, trọng tâm. Có dẫn nguồn (link) nếu tôi muốn đọc chi tiết. Đây là nội dung email cần chuyển đổi: """

def read_prompt_from_file(file_path: str) -> str:
    """Read prompt content from a text file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        raise Exception(f"Error reading file {file_path}: {str(e)}")

def get_api_key_count(config_path="config.yaml") -> int:
    """Get the number of API keys from config file."""
    try:
        with open(config_path, 'r') as file:
            config = yaml.safe_load(file)
        
        if 'gemini' in config and 'api_keys' in config['gemini']:
            return len(config['gemini']['api_keys'])
        return 1  # Default to 1 if no keys found
    except Exception:
        return 1  # Default to 1 in case of any error

def process_file(args: Tuple[str, str, str, str]) -> Tuple[str, bool, str]:
    """Process a single file using GeminiHandler."""
    input_path, output_path, config_path, model_name = args
    
    filename = os.path.basename(input_path)
    
    try:
        # Initialize handler for this process
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
            model_name=model_name
        )
        
        # Save result to JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        return (filename, True, "Success")
    except Exception as e:
        error_message = str(e)
        
        # Save error to a log file
        error_log_path = os.path.splitext(output_path)[0] + "_error.log"
        with open(error_log_path, 'w', encoding='utf-8') as f:
            f.write(f"Error processing file: {error_message}")
        
        return (filename, False, error_message)

def generate_json_reports(
    date: datetime.date = None,
    config_path: str = "config.yaml",
    model_name: str = "gemini-2.0-pro-exp-02-05",
    max_workers: int = None
) -> int:
    """
    Generate JSON reports from chunked email content using multiprocessing.
    
    Args:
        date: Date to process (defaults to yesterday)
        config_path: Path to config file
        model_name: Gemini model name to use
        max_workers: Maximum number of worker processes (defaults to half the number of API keys)
    
    Returns:
        int: Number of successfully processed files
    """
    # Determine the date to process
    if date is None:
        date = datetime.date.today() - datetime.timedelta(days=1)
    
    # Calculate number of workers based on API keys
    if max_workers is None:
        api_key_count = get_api_key_count(config_path)
        max_workers = max(1, api_key_count // 2)
    
    print(f"Using {max_workers} worker processes")
    
    # Set up directories
    base_dir = f"{date.strftime('%Y%m%d')}"
    input_dir = os.path.join(base_dir, "chunked_emails")
    output_dir = os.path.join(base_dir, "json_reports")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get list of all txt files in input directory
    try:
        input_files = [f for f in os.listdir(input_dir) if f.endswith('.txt')]
    except FileNotFoundError:
        print(f"Error: Input directory '{input_dir}' not found")
        return 0
    
    if not input_files:
        print(f"No .txt files found in '{input_dir}'")
        return 0
    
    print(f"Found {len(input_files)} files to process")
    
    # Prepare arguments for multiprocessing
    process_args = []
    for filename in input_files:
        input_path = os.path.join(input_dir, filename)
        output_filename = f"{os.path.splitext(filename)[0]}.json"
        output_path = os.path.join(output_dir, output_filename)
        process_args.append((input_path, output_path, config_path, model_name))
    
    # Process files using ProcessPoolExecutor
    successful_count = 0
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        for i, (filename, success, message) in enumerate(executor.map(process_file, process_args)):
            if success:
                print(f"[{i+1}/{len(input_files)}] Success: {filename}")
                successful_count += 1
            else:
                print(f"[{i+1}/{len(input_files)}] Error processing {filename}: {message}")
    
    print(f"Processing complete! Successfully generated {successful_count}/{len(input_files)} report files in {output_dir}")
    return successful_count
