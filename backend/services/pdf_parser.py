import os
import re
from pypdf import PdfReader

def extract_text_from_file(file_path):
    """
    Extracts raw text content from PDF or TXT files.
    Returns dict containing text, page_count, word_count, and extracted concepts.
    """
    ext = os.path.splitext(file_path)[1].lower()
    full_text = ""
    page_count = 1

    if ext == '.pdf':
        try:
            reader = PdfReader(file_path)
            page_count = len(reader.pages)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n\n"
        except Exception as e:
            print(f"Error parsing PDF file: {e}")
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    elif ext == '.txt':
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                full_text = f.read()
        except Exception as e:
            raise ValueError(f"Failed to read TXT file: {str(e)}")
    else:
        raise ValueError("Unsupported file format. Please upload a .pdf or .txt file.")

    # Clean text
    cleaned_text = clean_extracted_text(full_text)
    words = cleaned_text.split()
    word_count = len(words)
    
    # Extract topics/concepts using pattern analysis
    concepts = extract_key_concepts(cleaned_text)

    return {
        "text": cleaned_text,
        "page_count": page_count,
        "word_count": word_count,
        "concepts": concepts,
        "file_name": os.path.basename(file_path)
    }

def clean_extracted_text(text):
    """Clean whitespace, remove non-printable control characters."""
    text = re.sub(r'[\r\t]', ' ', text)
    text = re.sub(r' +', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def extract_key_concepts(text):
    """Extract major headings, capitalized phrases, and key domain terms."""
    # Find headers / bullet lines
    lines = text.split('\n')
    concepts = []
    
    for line in lines:
        line_str = line.strip()
        # Look for chapter/section titles or numbered lines
        if re.match(r'^(Chapter|Section|\d+\.|\b[A-Z\s]{4,}\b)', line_str) and len(line_str) < 80:
            clean_title = re.sub(r'^[0-9.#\-\s]+', '', line_str).strip()
            if clean_title and len(clean_title) > 3 and clean_title not in concepts:
                concepts.append(clean_title)
                
    # Fallback to key term frequency if no headings found
    if len(concepts) < 3:
        words = re.findall(r'\b[A-Z][a-z]{3,}\b', text)
        freq = {}
        for w in words:
            freq[w] = freq.get(w, 0) + 1
        sorted_terms = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        for term, count in sorted_terms[:8]:
            if term not in concepts:
                concepts.append(term)
                
    if not concepts:
        concepts = ["Core Concepts", "Key Definitions", "Important Principles", "Applications"]
        
    return concepts[:10]
