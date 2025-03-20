import datetime
import email
import imaplib
import os
import re
import sys
import traceback
from email.header import decode_header
from pathlib import Path

import html2text
import yaml


def load_config(config_path="config.yaml"):
    """
    Load configuration from YAML file.
    
    Args:
        config_path (str): Path to the configuration file
    
    Returns:
        dict: Configuration dictionary
    """
    try:
        with open(config_path, 'r') as file:
            config = yaml.safe_load(file)
        return config
    except Exception as e:
        print(f"Error loading configuration: {str(e)}")
        sys.exit(1)


def split_text_file(input_file_path, output_dir, max_chunk_size=15000):
    """
    Splits a text file into multiple files if it exceeds max_chunk_size characters.
    Each chunk will end at a complete sentence to maintain context.
    
    Args:
        input_file_path (str): Path to the input text file
        output_dir (str): Directory to save the output chunks
        max_chunk_size (int): Maximum size of each chunk in characters
    
    Returns:
        list: List of file paths where the chunks were saved
    """
    try:
        # Read the entire file
        with open(input_file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Get the base filename without directory
        base_filename = os.path.basename(input_file_path)
        base_name = base_filename.rsplit('.', 1)[0]
        extension = base_filename.rsplit('.', 1)[1] if '.' in base_filename else ''
        
        # If file is smaller than max_chunk_size, just copy it to output dir
        if len(content) <= max_chunk_size:
            output_file = os.path.join(output_dir, base_filename)
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return [output_file]
        
        # Split content into chunks
        chunks = []
        remaining_content = content
        
        while len(remaining_content) > 0:
            # If remaining content is less than max_chunk_size, add it as the last chunk
            if len(remaining_content) <= max_chunk_size:
                chunks.append(remaining_content)
                break
            
            # Find a good splitting point (end of a sentence) near max_chunk_size
            split_point = max_chunk_size
            
            # Look for sentence endings (.!?) followed by a space or newline
            sentence_endings = ['.', '!', '?']
            
            # Start from max_chunk_size and move backward to find sentence end
            while split_point > 0:
                if (split_point < len(remaining_content) and
                    remaining_content[split_point] in sentence_endings and 
                    (split_point + 1 >= len(remaining_content) or 
                     remaining_content[split_point + 1] in [' ', '\n'])):
                    split_point += 1  # Include the space after sentence
                    break
                split_point -= 1
            
            # If no sentence end found, just split at max_chunk_size
            if split_point == 0:
                split_point = min(max_chunk_size, len(remaining_content))
            
            # Add chunk and update remaining content
            chunks.append(remaining_content[:split_point])
            remaining_content = remaining_content[split_point:]
        
        # Save chunks to files
        output_files = []
        
        for i, chunk in enumerate(chunks):
            if extension:
                output_file = os.path.join(output_dir, f"{base_name}_chunk{i+1}.{extension}")
            else:
                output_file = os.path.join(output_dir, f"{base_name}_chunk{i+1}")
                
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(chunk)
            output_files.append(output_file)
        
        return output_files
    except Exception as e:
        print(f"Error processing file {input_file_path}: {str(e)}")
        traceback.print_exc()
        return []


def process_directory(input_dir, output_dir, max_chunk_size=15000):
    """
    Process all text files in the input directory and split them if needed.
    
    Args:
        input_dir (str): Directory containing input text files
        output_dir (str): Directory to save the output chunks
        max_chunk_size (int): Maximum size of each chunk in characters
        
    Returns:
        dict: Dictionary mapping input filenames to lists of output files
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all text files in the input directory
    try:
        input_files = [f for f in os.listdir(input_dir) if f.endswith('.txt')]
    except Exception as e:
        print(f"Error listing files in {input_dir}: {str(e)}")
        return {}
    
    results = {}
    
    # Process each file
    for filename in input_files:
        try:
            input_path = os.path.join(input_dir, filename)
            
            print(f"Processing {filename}...")
            output_files = split_text_file(input_path, output_dir, max_chunk_size)
            
            results[filename] = output_files
            
            if len(output_files) > 1:
                print(f"  Split into {len(output_files)} chunks")
            else:
                print(f"  File size <= {max_chunk_size}, copied without splitting")
        except Exception as e:
            print(f"Error processing {filename}: {str(e)}")
            continue
    
    return results


def get_llm_ready_emails(config, max_chunk_size=15000):
    """
    Fetches emails from yesterday, processes them for LLM consumption,
    and chunks large emails for better processing.
    
    Args:
        config (dict): Configuration containing email settings
        max_chunk_size (int): Maximum size of each chunk in characters
    """
    # Extract credentials from config
    try:
        email_address = config['gmail']['email']
        password = config['gmail']['email_app_password']
        imap_server = "imap.gmail.com"
    except KeyError as e:
        print(f"Missing required configuration: {e}")
        print("Please ensure your config.yaml contains gmail.email and gmail.email_app_password")
        return
    
    # Calculate yesterday's date
    yesterday = datetime.date.today() - datetime.timedelta(days=1)
    date_str = yesterday.strftime("%d-%b-%Y")  # Format: 19-Mar-2025
    
    print(f"Fetching emails from {date_str} for LLM processing...")
    
    # Connect to the IMAP server
    try:
        mail = imaplib.IMAP4_SSL(imap_server)
    except Exception as e:
        print(f"Error connecting to IMAP server: {str(e)}")
        return
    
    try:
        # Login to the account
        try:
            mail.login(email_address, password)
        except imaplib.IMAP4.error as e:
            print(f"Login failed: {str(e)}")
            print("Please check your email and app password in config.yaml")
            return
        
        # Tạo thư mục gốc theo ngày
        base_dir = f"{yesterday.strftime('%Y%m%d')}"
        os.makedirs(base_dir, exist_ok=True)
        
        # Tạo thư mục con cho nội dung email gốc
        save_dir = os.path.join(base_dir, "raw_emails")
        os.makedirs(save_dir, exist_ok=True)
        
        # Initialize HTML to text converter
        h2t = html2text.HTML2Text()
        h2t.ignore_links = False
        h2t.ignore_images = True
        h2t.ignore_tables = False
        
        email_count = 0
        
        # Process both inbox and spam folders
        for folder in ["INBOX", "[Gmail]/Spam"]:
            # Select the mailbox
            try:
                status, mailbox_data = mail.select(folder)
                if status != 'OK':
                    print(f"Could not select mailbox {folder}: {mailbox_data}")
                    continue
            except Exception as e:
                print(f"Error selecting mailbox {folder}: {str(e)}")
                continue
            
            # Search for all emails from yesterday
            search_criteria = f'(SINCE "{date_str}" BEFORE "{datetime.date.today().strftime("%d-%b-%Y")}")'
            try:
                status, messages = mail.search(None, search_criteria)
                if status != 'OK':
                    print(f"Search failed for {folder}: {messages}")
                    continue
            except Exception as e:
                print(f"Error searching emails in {folder}: {str(e)}")
                continue
            
            # Get the list of email IDs
            email_ids = messages[0].split()
            
            folder_name = "INBOX" if folder == "INBOX" else "SPAM"
            print(f"Found {len(email_ids)} emails in {folder_name} from yesterday.")
            
            # Process each email
            for i, email_id in enumerate(email_ids):
                try:
                    # Fetch the email
                    status, msg_data = mail.fetch(email_id, "(RFC822)")
                    if status != 'OK':
                        print(f"Failed to fetch email {email_id}: {msg_data}")
                        continue
                    
                    # Parse the email content
                    raw_email = msg_data[0][1]
                    msg = email.message_from_bytes(raw_email)
                    
                    # Get email subject
                    subject_parts = decode_header(msg.get("Subject", "No Subject"))
                    subject = ""
                    for part, encoding in subject_parts:
                        if isinstance(part, bytes):
                            # Use specified encoding or utf-8 as fallback
                            subject += part.decode(encoding or 'utf-8', errors='replace')
                        else:
                            subject += str(part)
                    
                    # Get sender
                    from_addr = msg.get("From", "")
                    
                    # Clean up the subject for filename
                    clean_subject = "".join([c if c.isalnum() else "_" for c in subject])[:50]
                    
                    # Process email body
                    body_text = ""
                    
                    if msg.is_multipart():
                        for part in msg.walk():
                            content_type = part.get_content_type()
                            content_disposition = str(part.get("Content-Disposition"))
                            
                            # Skip attachments
                            if "attachment" in content_disposition:
                                continue
                            
                            # Get the body
                            try:
                                if content_type == "text/plain":
                                    body = part.get_payload(decode=True)
                                    if body:
                                        charset = part.get_content_charset() or 'utf-8'
                                        body_text += body.decode(charset, errors='replace')
                                elif content_type == "text/html" and not body_text:
                                    # Convert HTML to plain text if we don't have text content
                                    html_body = part.get_payload(decode=True)
                                    if html_body:
                                        charset = part.get_content_charset() or 'utf-8'
                                        body_text += h2t.handle(html_body.decode(charset, errors='replace'))
                            except Exception as e:
                                print(f"Error processing email part: {str(e)}")
                                continue
                    else:
                        # Not multipart - get the content directly
                        try:
                            payload = msg.get_payload(decode=True)
                            if payload:
                                content_type = msg.get_content_type()
                                charset = msg.get_content_charset() or 'utf-8'
                                if content_type == "text/plain":
                                    body_text = payload.decode(charset, errors='replace')
                                elif content_type == "text/html":
                                    html_body = payload.decode(charset, errors='replace')
                                    body_text = h2t.handle(html_body)
                        except Exception as e:
                            print(f"Error decoding message body: {str(e)}")
                            body_text = "Could not decode message body"
                    
                    # Clean up the text content
                    body_text = re.sub(r'\n{3,}', '\n\n', body_text)  # Remove excess newlines
                    body_text = re.sub(r'\s{2,}', ' ', body_text)     # Remove excess spaces
                    
                    # Format the email content for LLM
                    email_content = f"EMAIL {i+1}\n"
                    email_content += f"From: {from_addr}\n"
                    email_content += f"Subject: {subject}\n"
                    email_content += f"Date: {msg.get('Date', '')}\n"
                    email_content += f"Folder: {folder_name}\n\n"
                    email_content += f"CONTENT:\n{body_text.strip()}\n\n"
                    
                    # Write to individual file
                    individual_file = f"{save_dir}/{folder_name.lower()}_{i+1:03d}_{clean_subject}.txt"
                    with open(individual_file, "w", encoding="utf-8") as f:
                        f.write(email_content)
                    
                    email_count += 1
                    print(f"Processed {folder_name} email {i+1}/{len(email_ids)}: {subject}")
                
                except Exception as e:
                    print(f"Error processing email {email_id}: {str(e)}")
                    traceback.print_exc()
                    continue
        
        if email_count == 0:
            print(f"No emails found from {date_str}.")
            return
            
        print(f"\nAll emails from {date_str} have been processed and saved to '{save_dir}'.")
        
        # Now chunk the files if they're too large
        chunked_dir = os.path.join(base_dir, "chunked_emails")
        os.makedirs(chunked_dir, exist_ok=True)
        
        print(f"\nChunking large files (limit: {max_chunk_size} characters)...")
        print(f"Source directory: {save_dir}")
        print(f"Target chunked directory: {chunked_dir}")
        
        # Process the directory and split files if needed
        try:
            chunk_results = process_directory(save_dir, chunked_dir, max_chunk_size)
            
            if not chunk_results:
                print("No files were processed for chunking. Check if any emails were saved.")
                return
                
            # Print summary of chunking
            total_files = len(chunk_results)
            total_chunks = sum(len(chunks) for chunks in chunk_results.values())
            split_files = sum(1 for chunks in chunk_results.values() if len(chunks) > 1)
            
            print(f"\nChunking Summary:")
            print(f"Processed {total_files} files")
            print(f"Created {total_chunks} output files")
            print(f"Split {split_files} files into multiple chunks")
            print(f"Chunked files are available in '{chunked_dir}'")
        except Exception as e:
            print(f"Error during chunking process: {str(e)}")
            traceback.print_exc()
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        traceback.print_exc()
    
    finally:
        # Close the connection
        try:
            mail.logout()
        except:
            pass


