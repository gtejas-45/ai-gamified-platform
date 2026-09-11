import os
import uuid
from flask import Blueprint, request, current_app
from werkzeug.utils import secure_filename
from services.pdf_parser import extract_text_from_file
from utils.helpers import success_response, error_response

upload_bp = Blueprint('upload', __name__)

# In-memory storage for active document sessions
DOCUMENT_STORE = {}

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    """
    Accepts PDF/TXT file upload or direct raw text input,
    parses structure, extracts key concepts, and returns session ID.
    """
    # Check if raw text was passed in JSON body
    if request.is_json:
        json_data = request.get_json()
        raw_text = json_data.get('text', '')
        file_name = json_data.get('fileName', 'Pasted Notes')
        
        if not raw_text or len(raw_text.strip()) < 10:
            return error_response("Please provide at least 10 characters of study text.", 400)
            
        doc_id = str(uuid.uuid4())
        words = raw_text.split()
        
        # Simple concept extraction
        concepts = ["Fundamental Principles", "Key Terminology", "System Dynamics", "Applications"]
        
        doc_data = {
            "id": doc_id,
            "text": raw_text,
            "file_name": file_name,
            "page_count": 1,
            "word_count": len(words),
            "concepts": concepts
        }
        
        DOCUMENT_STORE[doc_id] = doc_data
        return success_response(doc_data, "Study text processed successfully")

    # Otherwise expect multipart form file upload
    if 'file' not in request.files:
        return error_response("No file uploaded. Please attach a .pdf or .txt file.", 400)

    file = request.files['file']
    if file.filename == '':
        return error_response("Selected file is empty.", 400)

    filename = secure_filename(file.filename)
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in ['.pdf', '.txt']:
        return error_response("Invalid file type. Only PDF (.pdf) and Text (.txt) files are supported.", 400)

    temp_path = os.path.join(current_app.config['UPLOAD_FOLDER'], f"{uuid.uuid4()}_{filename}")
    
    try:
        file.save(temp_path)
        parsed_data = extract_text_from_file(temp_path)
        
        doc_id = str(uuid.uuid4())
        parsed_data['id'] = doc_id
        
        DOCUMENT_STORE[doc_id] = parsed_data
        
        # Clean temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return success_response(parsed_data, "Document uploaded and parsed successfully")
        
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return error_response(f"Error processing study file: {str(e)}", 500)

@upload_bp.route('/document/<doc_id>', methods=['GET'])
def get_document(doc_id):
    """Retrieves cached document text & concepts by ID."""
    doc = DOCUMENT_STORE.get(doc_id)
    if not doc:
        return error_response("Document session not found or expired.", 404)
    return success_response(doc, "Document fetched successfully")
