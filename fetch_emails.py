import datetime
import email
import imaplib
import os
import re
from email.header import decode_header

import html2text


def get_llm_ready_emails(email_address, password, imap_server="imap.gmail.com"):
    # Calculate yesterday's date
    yesterday = datetime.date.today() - datetime.timedelta(days=1)
    date_str = yesterday.strftime("%d-%b-%Y")  # Format: 19-Mar-2025
    
    print(f"Fetching emails from {date_str} for LLM processing...")
    
    # Connect to the IMAP server
    mail = imaplib.IMAP4_SSL(imap_server)
    
    try:
        # Login to the account
        mail.login(email_address, password)
        
        # Create a directory to save LLM-ready content
        save_dir = f"llm_content_{yesterday.strftime('%Y%m%d')}"
        os.makedirs(save_dir, exist_ok=True)
        
        # Create a single file for all processed content
        all_content_file = f"{save_dir}/all_emails_content.txt"
        
        # Initialize HTML to text converter
        h2t = html2text.HTML2Text()
        h2t.ignore_links = False
        h2t.ignore_images = True
        h2t.ignore_tables = False
        
        with open(all_content_file, "w", encoding="utf-8") as all_content:
            all_content.write(f"=== EMAILS FROM {date_str} ===\n\n")
            
            # Process both inbox and spam folders
            for folder in ["INBOX", "[Gmail]/Spam"]:
                # Select the mailbox
                mail.select(folder)
                
                # Search for all emails from yesterday
                search_criteria = f'(SINCE "{date_str}" BEFORE "{datetime.date.today().strftime("%d-%b-%Y")}")'
                status, messages = mail.search(None, search_criteria)
                
                # Get the list of email IDs
                email_ids = messages[0].split()
                
                folder_name = "INBOX" if folder == "INBOX" else "SPAM"
                print(f"Found {len(email_ids)} emails in {folder_name} from yesterday.")
                
                # Process each email
                for i, email_id in enumerate(email_ids):
                    # Fetch the email
                    status, msg_data = mail.fetch(email_id, "(RFC822)")
                    
                    # Parse the email content
                    raw_email = msg_data[0][1]
                    msg = email.message_from_bytes(raw_email)
                    
                    # Get email subject
                    subject = decode_header(msg["Subject"])[0][0]
                    if isinstance(subject, bytes):
                        subject = subject.decode()
                    
                    # Get sender
                    from_addr = msg.get("From", "")
                    
                    # Clean up the subject for filename
                    clean_subject = "".join([c if c.isalnum() else "_" for c in subject])[:50]
                    
                    # Extract email content for LLM processing
                    email_content = ""
                    
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
                                    body = part.get_payload(decode=True).decode()
                                    body_text += body
                                elif content_type == "text/html" and not body_text:
                                    # Convert HTML to plain text if we don't have text content
                                    html_body = part.get_payload(decode=True).decode()
                                    body_text += h2t.handle(html_body)
                            except:
                                continue
                    else:
                        # Not multipart - get the content directly
                        try:
                            payload = msg.get_payload(decode=True)
                            if payload:
                                content_type = msg.get_content_type()
                                if content_type == "text/plain":
                                    body_text = payload.decode()
                                elif content_type == "text/html":
                                    html_body = payload.decode()
                                    body_text = h2t.handle(html_body)
                        except:
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
                    email_content += "="*50 + "\n\n"
                    
                    # Write to individual file
                    individual_file = f"{save_dir}/{folder_name.lower()}_{i+1:03d}_{clean_subject}.txt"
                    with open(individual_file, "w", encoding="utf-8") as f:
                        f.write(email_content)
                    
                    # Append to the all-content file
                    all_content.write(email_content)
                    
                    print(f"Processed {folder_name} email {i+1}/{len(email_ids)}: {subject}")
        
        print(f"All emails from {date_str} have been processed and saved to '{save_dir}'.")
        print(f"Combined content is available at '{all_content_file}'.")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
    
    finally:
        # Close the connection
        mail.logout()

if __name__ == "__main__":
    # Replace with your email credentials
    email_address = "lethanhson9910@gmail.com"
    password = "anht xfoj mbhc kxjw"
    
    # For Gmail, you may need to use an App Password
    # instead of your regular password if you have 2FA enabled
    # https://support.google.com/accounts/answer/185833
    
    get_llm_ready_emails(email_address, password)