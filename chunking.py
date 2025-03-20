import os

from docling.chunking import HybridChunker
from docling.document_converter import DocumentConverter
from transformers import AutoTokenizer


def process_md_files(input_dir, output_dir=None, embed_model_id="nomic-ai/nomic-embed-text-v1.5", max_tokens=4000):
    """
    Hàm xử lý tất cả file '_cleaned.md' trong thư mục và thư mục con, chia chunk và ghi ra file mới.
    
    Parameters:
    - input_dir (str): Đường dẫn thư mục đầu vào chứa các file '_cleaned.md'.
    - output_dir (str, optional): Thư mục đầu ra, nếu None thì dùng cùng thư mục đầu vào.
    - embed_model_id (str): ID của mô hình embedding, mặc định là "nomic-ai/nomic-embed-text-v1.5".
    - max_tokens (int): Số token tối đa cho mỗi chunk, mặc định là 4000.
    """
    # Nếu không chỉ định thư mục đầu ra, dùng thư mục đầu vào
    if output_dir is None:
        output_dir = input_dir
    
    # Tạo thư mục đầu ra nếu chưa tồn tại
    os.makedirs(output_dir, exist_ok=True)

    # Khởi tạo tokenizer
    tokenizer = AutoTokenizer.from_pretrained(embed_model_id)

    # Khởi tạo HybridChunker
    chunker = HybridChunker(
        tokenizer=tokenizer,
        max_tokens=max_tokens,
        merge_peers=True
    )

    # Duyệt qua tất cả file trong thư mục và thư mục con
    for root, _, files in os.walk(input_dir):
        for file_name in files:
            if file_name.endswith("_cleaned.md"):
                # Đường dẫn đầy đủ của file đầu vào
                input_file_path = os.path.join(root, file_name)
                
                # Tạo tên file đầu ra: thay '_cleaned.md' bằng '_chunked.md'
                output_file_name = file_name.replace("_cleaned.md", "_chunked.md")
                output_file_path = os.path.join(output_dir, output_file_name)

                print(f"Đang xử lý: {input_file_path} -> {output_file_path}")

                # Chuyển đổi tài liệu
                doc = DocumentConverter().convert(source=input_file_path).document

                # Chia chunk
                chunk_iter = chunker.chunk(dl_doc=doc)
                chunks = list(chunk_iter)

                # Ghi kết quả ra file
                with open(output_file_path, 'w', encoding='utf-8') as f:
                    for i, chunk in enumerate(chunks):
                        txt_tokens = len(tokenizer.tokenize(chunk.text))
                        ser_txt = chunker.serialize(chunk=chunk)
                        ser_tokens = len(tokenizer.tokenize(ser_txt))

                        f.write(f"=== {i} ===\n")
                        f.write(f"chunk.text ({txt_tokens} tokens):\n{repr(chunk.text)}\n")
                        f.write(f"chunker.serialize(chunk) ({ser_tokens} tokens):\n{repr(ser_txt)}\n")
                        f.write("\n")

                print(f"Hoàn thành: {output_file_path}")

# Ví dụ sử dụng
if __name__ == "__main__":
    input_directory = "/home/son/Downloads/result_crop_pdf_files"
    process_md_files(input_directory)