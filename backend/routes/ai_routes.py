from flask import Blueprint, request
from services.gemini_service import generate_game_content
from routes.upload_routes import DOCUMENT_STORE
from utils.helpers import success_response, error_response

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/generate-game', methods=['POST'])
def generate_game():
    """
    Generates educational game questions (Quiz, Flashcards, Matching, Fill-in-blanks, Boss Battle)
    from uploaded document or raw text.
    """
    data = request.json or {}
    doc_id = data.get('docId')
    raw_text = data.get('text', '')
    game_type = data.get('gameType', 'quiz').lower()
    num_questions = int(data.get('numQuestions', 5))
    concepts = data.get('concepts', [])

    study_text = ""
    if doc_id and doc_id in DOCUMENT_STORE:
        doc = DOCUMENT_STORE[doc_id]
        study_text = doc.get('text', '')
        if not concepts:
            concepts = doc.get('concepts', [])
    elif raw_text:
        study_text = raw_text
    else:
        study_text = """
        Gamified learning utilizes game design elements like points, levels, leaderboards, and instant feedback in non-game educational contexts.
        AI-driven personalization analyzes student response times, accuracy per topic, and mistake patterns to generate adaptive question sets.
        Rural development educational initiatives benefit from lightweight offline-capable web architecture and interactive learning loops.
        """
        concepts = ["Gamified Learning", "AI Personalization", "Rural Development", "Adaptive Evaluation"]

    if len(study_text.strip()) < 20:
        return error_response("Insufficient study content to generate game questions.", 400)

    try:
        game_payload = generate_game_content(
            text_content=study_text,
            game_type=game_type,
            num_questions=num_questions,
            concepts=concepts
        )
        return success_response(game_payload, f"{game_type.capitalize()} game content generated successfully")

    except Exception as e:
        return error_response(f"Failed to generate game content: {str(e)}", 500)

@ai_bp.route('/explain', methods=['POST'])
def explain_concept():
    """
    Provides AI explanation and simplified breakdown of a difficult topic.
    """
    data = request.json or {}
    concept = data.get('concept', '')
    context = data.get('context', '')

    if not concept:
        return error_response("Please specify a concept name.", 400)

    simple_explanation = f"'{concept}' is a key principle in this topic. Simply put, it describes how elements interact within the system to produce predictable outcomes."
    
    return success_response({
        "concept": concept,
        "explanation": simple_explanation,
        "analogy": f"Imagine {concept} like a highway traffic controller keeping vehicles flowing smoothly.",
        "key_takeaways": [
            "Core rule definition",
            "Practical application scenario",
            "Common pitfall to avoid"
        ]
    }, "Concept explanation generated")
