import os
import re

import tiktoken


def count_file_metrics(folder_name="llm_content_20250319"):
    """
    Count the number of characters, words, and tokens in each file within the specified folder.
    
    Args:
        folder_name: The name of the folder to analyze (default: llm_content_20250319)
        
    Returns:
        A dictionary with filenames as keys and dictionaries of metrics as values
    """
    metrics = {}
    
    # Load tiktoken encoding (using cl100k_base which is used by most modern models)
    try:
        encoding = tiktoken.get_encoding("cl100k_base")
    except Exception as e:
        print(f"Error loading tiktoken encoding: {str(e)}")
        print("Make sure you have tiktoken installed. Run: pip install tiktoken")
        return metrics
    
    # Check if the folder exists
    if not os.path.exists(folder_name):
        print(f"Folder '{folder_name}' does not exist.")
        return metrics
    
    # Get all files in the folder
    try:
        files = [f for f in os.listdir(folder_name) if os.path.isfile(os.path.join(folder_name, f))]
        
        # Initialize totals
        total_chars = 0
        total_words = 0
        total_tokens = 0
        
        # Process each file
        for filename in files:
            file_path = os.path.join(folder_name, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Calculate metrics
                    char_count = len(content)
                    word_count = len(re.findall(r'\b\w+\b', content))
                    token_count = len(encoding.encode(content))
                    
                    # Store metrics
                    metrics[filename] = {
                        "characters": char_count,
                        "words": word_count,
                        "tokens": token_count
                    }
                    
                    # Add to totals
                    total_chars += char_count
                    total_words += word_count
                    total_tokens += token_count
                    
                    # Print results for this file
                    print(f"{filename}:")
                    print(f"  - Characters: {char_count}")
                    print(f"  - Words: {word_count}")
                    print(f"  - Tokens: {token_count}")
                    
            except Exception as e:
                print(f"Error processing file {filename}: {str(e)}")
                metrics[filename] = "Error"
        
        # Print totals
        print("\nTOTAL ACROSS ALL FILES:")
        print(f"  - Characters: {total_chars}")
        print(f"  - Words: {total_words}")
        print(f"  - Tokens: {total_tokens}")
        
        # Add totals to metrics dictionary
        metrics["_totals"] = {
            "characters": total_chars,
            "words": total_words,
            "tokens": total_tokens
        }
        
    except Exception as e:
        print(f"Error accessing folder: {str(e)}")
    
    return metrics

# Example usage
if __name__ == "__main__":
    # First, make sure tiktoken is installed
    # If not, you'll need to install it with: pip install tiktoken
    
    # Call the function with default folder name
    file_metrics = count_file_metrics()
    
    # Or specify a different folder name
    # file_metrics = count_file_metrics("llm_content_20250320")