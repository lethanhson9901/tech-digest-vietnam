# convert.py

import datetime
import json
import os
import re
from collections import defaultdict


def extract_index(filename):
    """Extract the index number from the filename."""
    index_pattern = re.compile(r'inbox_(\d+)_')
    match = index_pattern.search(filename)
    if match:
        return int(match.group(1))
    return 999  # Default high value for files that don't match the pattern

def extract_chunk_num(filename):
    """Extract the chunk number from the filename."""
    chunk_pattern = re.compile(r'chunk(\d+)')
    match = chunk_pattern.search(filename)
    if match:
        return int(match.group(1))
    return 1  # Default for files that aren't chunks

def get_title_from_filename(filename):
    """Extract a readable title from the filename."""
    # Remove prefix, file extension and replace underscores with spaces
    name = filename.replace('inbox_', '').replace('.json', '')
    # Remove the index number at the beginning
    name = re.sub(r'^\d+_', '', name)
    # Replace underscores with spaces
    name = name.replace('_', ' ')
    # Fix spacing around special characters
    name = re.sub(r'__+', ': ', name)
    name = re.sub(r'_+', ' ', name)
    # Capitalize words properly
    name = ' '.join(word.capitalize() if word.lower() not in ['and', 'in', 'of', 'with', 'vs', 'vs.', 'to', 'the', 'a', 'an'] 
                   or i == 0 else word.lower() 
                   for i, word in enumerate(name.split()))
    # Clean up any remaining underscores and improve readability
    name = name.replace('Ai', 'AI').replace('3d', '3D')
    # Replace ampersands and slashes
    name = name.replace(' And ', ' & ').replace('Vs ', 'vs. ')
    
    return name

def process_json_file(file_path):
    """Extract meaningful content from a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Check if there's structured data
        if 'structured_data' in data and data['structured_data']:
            content = data['structured_data']
        # Otherwise try to parse the text field as JSON
        elif 'text' in data and data['text']:
            try:
                content = json.loads(data['text'])
            except:
                content = {"text": data['text']}
        else:
            content = {"error": "No content found"}
            
        return content
    except Exception as e:
        return {"error": f"Error processing file: {str(e)}"}

def get_report_title(content):
    """Extract report title from content if available."""
    if isinstance(content, dict) and 'reportTitle' in content:
        return content['reportTitle']
    return None

def format_content_as_markdown(content, title):
    """Format the content as markdown."""
    md = []
    
    # If it's a newsletter format with from/reportTitle/sections
    if isinstance(content, dict) and 'from' in content and 'sections' in content:
        source = content.get('from', 'Unknown Source')
        # We now handle reportTitle in the main function
        
        md.append(f"*Source: {source}*\n")
        
        for section in content.get('sections', []):
            if 'title' in section and section['title']:
                md.append(f"### {section['title']}")
            
            for article in section.get('articles', []):
                if 'headline' in article and article['headline']:
                    md.append(f"**{article['headline']}**")
                
                if 'summary' in article and article['summary']:
                    md.append(article['summary'])
                
                if 'link' in article and article['link']:
                    md.append(f"[Read more]({article['link']})")
                
                md.append("")  # Add empty line between articles
    
    # Simple text content
    elif isinstance(content, dict) and 'text' in content:
        md.append(content['text'])
    
    # Error message
    elif isinstance(content, dict) and 'error' in content:
        md.append(f"*Error processing content: {content['error']}*")
    
    # Fallback for other structures
    else:
        md.append(f"*Content available but format not recognized for {title}*")
    
    return "\n".join(md)

def generate_toc(entries):
    """Generate a table of contents from the list of entries."""
    toc = ["## Table of Contents\n"]
    for i, (title, report_title, anchor) in enumerate(entries, 1):
        # Create an anchor-friendly version of the title for linking
        anchor_text = f"#{i}-{anchor}"
        
        # Format the TOC entry
        if report_title:
            toc.append(f"{i}. [{title}]({anchor_text}): {report_title}")
        else:
            toc.append(f"{i}. [{title}]({anchor_text})")
    
    return "\n".join(toc) + "\n\n---\n"

def convert_to_beautiful_md(date=None, base_path=None):
    # Xác định ngày nếu không được truyền vào
    if date is None:
        date = datetime.date.today() - datetime.timedelta(days=1)
    
    # Tạo đường dẫn đến thư mục base và json_reports
    if base_path is None:
        base_path = f"{date.strftime('%Y%m%d')}"
    
    json_dir = os.path.join(base_path, "json_reports")
    
    # Output file - saved in the base directory, not in json_reports
    output_file = os.path.join(base_path, f"tech_news_digest_{date.strftime('%Y%m%d')}.md")
    
    # Đảm bảo thư mục tồn tại
    if not os.path.exists(json_dir):
        print(f"Error: Directory {json_dir} doesn't exist")
        return None
        
    # Get all JSON files
    files = [f for f in os.listdir(json_dir) if f.endswith('.json')]
    
    if not files:
        print(f"Error: No JSON files found in {json_dir}")
        return None
    
    # Group chunks together
    file_groups = defaultdict(list)
    
    for filename in files:
        base_name = re.sub(r'_chunk\d+', '', filename)
        file_groups[base_name].append(filename)
    
    # Sort the groups by their index
    sorted_groups = sorted(file_groups.items(), key=lambda x: extract_index(x[0]))
    
    # First pass to extract report titles
    toc_entries = []
    processed_contents = []
    
    for base_name, filenames in sorted_groups:
        title = get_title_from_filename(base_name)
        anchor = title.lower().replace(' ', '-').replace(':', '').replace('&', 'and')
        anchor = re.sub(r'[^\w\-]', '', anchor)
        
        # Sort chunks if there are multiple files
        sorted_files = sorted(filenames, key=extract_chunk_num)
        
        combined_content = {}
        for filename in sorted_files:
            content = process_json_file(os.path.join(json_dir, filename))
            
            # For first file or if no chunks, just use the content
            if not combined_content or len(sorted_files) == 1:
                combined_content = content
            # Otherwise append content from chunks
            else:
                # This is a basic approach to combining chunks
                if isinstance(content, dict) and isinstance(combined_content, dict):
                    if 'text' in content and 'text' in combined_content:
                        combined_content['text'] += "\n" + content['text']
                    # For structured data, we might need to merge sections or articles
                    if 'sections' in content and 'sections' in combined_content:
                        combined_content['sections'].extend(content['sections'])
                    if 'articles' in content and 'articles' in combined_content:
                        combined_content['articles'].extend(content['articles'])
        
        report_title = get_report_title(combined_content)
        toc_entries.append((title, report_title, anchor))
        processed_contents.append((title, anchor, combined_content))
    
    # Format the date for display
    formatted_date = date.strftime("%B %d, %Y")
    
    # Prepare the output
    with open(output_file, 'w', encoding='utf-8') as out:
        # Write the title and date
        out.write(f"# Tech News Digest - {formatted_date}\n\n")
        
        # Write the table of contents
        out.write(generate_toc(toc_entries))
        
        # Write each section
        for i, (title, anchor, combined_content) in enumerate(processed_contents, 1):
            out.write(f"## {i}. {title}<a id=\"{i}-{anchor}\"></a>\n")
            
            # Add report title if available, but skip it in the content formatting
            report_title = get_report_title(combined_content)
            if report_title:
                out.write(f"*{report_title}*\n\n")
            
            markdown_content = format_content_as_markdown(combined_content, title)
            out.write(markdown_content + "\n\n")
            
            # Add a divider between sections
            if i < len(processed_contents):
                out.write("---\n\n")
        
        out.write(f"*Generated on {formatted_date}*")
    
    print(f"Markdown file created: {output_file}")
    return output_file

# if __name__ == "__main__":
#     convert_to_beautiful_md()
