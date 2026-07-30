import os
import sys
import shutil
import urllib.request

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models')
MODEL_FILE = os.path.join(MODEL_DIR, 'gemma-4-E4B-it.gguf')

# Primary HF Direct Download URL
HF_DOWNLOAD_URL = "https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF/resolve/main/gemma-4-E4B-it-UD-Q4_K_XL.gguf"

# Local HF Cache fallback source
HF_CACHE_BLOB = r"C:\Users\Parth\.cache\huggingface\hub\models--unsloth--gemma-4-E4B-it-GGUF\blobs\30d1e7949597a3446726064e80b876fd1b5cba4aa6eec53d27afa420e731fb36"

def ensure_model():
    os.makedirs(MODEL_DIR, exist_ok=True)

    if os.path.exists(MODEL_FILE) and os.path.getsize(MODEL_FILE) > 100 * 1024 * 1024:
        size_gb = round(os.path.getsize(MODEL_FILE) / (1024 ** 3), 2)
        print(f"[OK] Model verified: {MODEL_FILE} ({size_gb} GB)")
        return True

    print("\n" + "=" * 70)
    print("  [+] Setting up optimal model for RTX 5050 (Gemma 4 E4B IT -- 4.88GB)")
    print("=" * 70)

    # 1. Try local HF cache copy first (Instant)
    if os.path.exists(HF_CACHE_BLOB) and os.path.getsize(HF_CACHE_BLOB) > 100 * 1024 * 1024:
        print(f"[*] Copying from local HuggingFace cache to {MODEL_FILE}...")
        shutil.copyfile(HF_CACHE_BLOB, MODEL_FILE)
        size_gb = round(os.path.getsize(MODEL_FILE) / (1024 ** 3), 2)
        print(f"[OK] Model successfully prepared: {MODEL_FILE} ({size_gb} GB)\n")
        return True

    # 2. Download directly from HuggingFace if not local
    print(f"[*] Downloading Gemma 4 E4B IT GGUF from HuggingFace...")
    print(f"    URL: {HF_DOWNLOAD_URL}")
    print("    This is a one-time download (~4.88 GB). Please wait...")

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
