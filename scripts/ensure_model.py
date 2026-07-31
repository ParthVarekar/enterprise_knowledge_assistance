import os
import sys
import shutil
import urllib.request

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models')
MODEL_FILE = os.path.join(MODEL_DIR, 'qwen-3.5-9b-it.gguf')

# HuggingFace Direct Download URL for Qwen GGUF Model
HF_DOWNLOAD_URL = "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF/resolve/main/qwen2.5-7b-instruct-q4_k_m.gguf"

# Local HF Cache fallback check
HF_CACHE_DIR = r"C:\Users\Parth\.cache\huggingface\hub"

def find_local_qwen_cache():
    if not os.path.exists(HF_CACHE_DIR):
        return None
    for root, dirs, files in os.walk(HF_CACHE_DIR):
        for f in files:
            if ('qwen' in f.lower() or 'qwen' in root.lower()) and f.endswith('.gguf'):
                full_path = os.path.join(root, f)
                if os.path.getsize(full_path) > 500 * 1024 * 1024:
                    return full_path
    return None

def ensure_model():
    os.makedirs(MODEL_DIR, exist_ok=True)

    # 1. Check if target model already exists in models/
    if os.path.exists(MODEL_FILE) and os.path.getsize(MODEL_FILE) > 500 * 1024 * 1024:
        size_gb = round(os.path.getsize(MODEL_FILE) / (1024 ** 3), 2)
        print(f"[OK] Model verified: {MODEL_FILE} ({size_gb} GB)")
        return True

    print("\n" + "=" * 70)
    print("  [+] Setting up optimal Qwen Model for RTX 5050 GPU (Qwen3.5/2.5-9B IT GGUF)")
    print("=" * 70)

    # 2. Check local HuggingFace cache first
    local_cache = find_local_qwen_cache()
    if local_cache:
        print(f"[*] Copying from local HuggingFace cache to {MODEL_FILE}...")
        shutil.copyfile(local_cache, MODEL_FILE)
        size_gb = round(os.path.getsize(MODEL_FILE) / (1024 ** 3), 2)
        print(f"[OK] Model successfully prepared: {MODEL_FILE} ({size_gb} GB)\n")
        return True

    # 3. Download directly from HuggingFace if not present
    print(f"[*] Downloading Qwen3.5-9B / Qwen2.5-7B IT GGUF from HuggingFace...")
    print(f"    URL: {HF_DOWNLOAD_URL}")
    print("    This is a one-time download (~4.68 GB). Please wait...")

    def progress_bar(block_num, block_size, total_size):
        downloaded = block_num * block_size
        if total_size > 0:
            percent = min(100, int((downloaded / total_size) * 100))
            mb_down = round(downloaded / (1024 * 1024), 1)
            mb_total = round(total_size / (1024 * 1024), 1)
            sys.stdout.write(f"\r    Downloading: [{percent}%] {mb_down}/{mb_total} MB")
            sys.stdout.flush()

    try:
        urllib.request.urlretrieve(HF_DOWNLOAD_URL, MODEL_FILE, reporthook=progress_bar)
        print(f"\n[OK] Download complete: {MODEL_FILE}\n")
        return True
    except Exception as e:
        print(f"\n[!] Download error: {e}")
        if os.path.exists(MODEL_FILE):
            os.remove(MODEL_FILE)
        return False

if __name__ == '__main__':
    ensure_model()
