import json
import os
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

# Initialize your handler with system prompt
handler = GeminiHandler(
    config_path="config.yaml",
    system_instruction=system_instruction
)

# Input and output directories
input_dir = "chunked_content_20250319"
output_dir = "json_reports_20250319"

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Get list of all txt files in input directory
input_files = [f for f in os.listdir(input_dir) if f.endswith('.txt')]

# Process each file
for i, filename in enumerate(input_files):
    input_path = os.path.join(input_dir, filename)
    output_filename = f"{os.path.splitext(filename)[0]}.json"
    output_path = os.path.join(output_dir, output_filename)
    
    print(f"Processing file {i+1}/{len(input_files)}: {filename}")
    
    try:
        # Read content from file
        email_content = read_prompt_from_file(input_path)
        
        # Generate structured content
        result = handler.generate_structured_content(
            prompt=email_content,
            schema=report_schema,
            model_name="gemini-2.0-pro-exp-02-05"
        )
        
        # Save result to JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"  Success! Saved to {output_path}")
        
    except Exception as e:
        print(f"  Error processing {filename}: {str(e)}")
        
        # Optionally save error to a log file
        with open(os.path.join(output_dir, f"{os.path.splitext(filename)[0]}_error.log"), 'w') as f:
            f.write(f"Error processing file: {str(e)}")

print(f"Processing complete! Generated {len(input_files)} report files in {output_dir}")
