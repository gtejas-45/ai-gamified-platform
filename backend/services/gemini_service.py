import os
import json
import re
import random

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

def get_gemini_client():
    api_key = os.getenv('GEMINI_API_KEY', '')
    if GENAI_AVAILABLE and api_key:
        genai.configure(api_key=api_key)
        # Use gemini-1.5-flash or gemini-pro
        model = genai.GenerativeModel('gemini-1.5-flash')
        return model
    return None

def generate_game_content(text_content, game_type="quiz", num_questions=5, concepts=None):
    """
    Generates structured game content (MCQs, Flashcards, Matching Pairs, Blanks, Boss Challenge).
    Uses Gemini API if available, with robust smart fallback generator.
    """
    concepts = concepts or ["Core Concept", "Key Principles", "Applications"]
    model = get_gemini_client()

    if model:
        try:
            return generate_with_gemini(model, text_content, game_type, num_questions, concepts)
        except Exception as e:
            print(f"Gemini API error, falling back to smart generator: {e}")
            return generate_fallback_content(text_content, game_type, num_questions, concepts)
    else:
        return generate_fallback_content(text_content, game_type, num_questions, concepts)

def generate_with_gemini(model, text_content, game_type, num_questions, concepts):
    truncated_text = text_content[:4000] # Fit prompt window

    prompt = f"""
You are an expert AI educational content creator. Analyze the study material below and create a high-quality educational game of type '{game_type}'.

Study Material:
{truncated_text}

Key Concepts to cover: {', '.join(concepts[:5])}

Output MUST be strictly valid JSON without markdown codeblock formatting or extraneous text.

JSON format requirements per game_type:

If game_type == 'quiz':
{{
  "title": "Topic Quiz Challenge",
  "questions": [
    {{
      "id": 1,
      "question": "Clear question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "topic": "Concept Name",
      "explanation": "Detailed explanation of why this option is correct."
    }}
  ]
}}

If game_type == 'flashcards':
{{
  "title": "Concept Flashcards",
  "cards": [
    {{
      "id": 1,
      "front": "Term / Question / Prompt",
      "back": "Detailed definition or answer explanation",
      "hint": "Subtle memory hint",
      "topic": "Topic Name"
    }}
  ]
}}

If game_type == 'matching':
{{
  "title": "Matching Pairs Challenge",
  "pairs": [
    {{
      "id": 1,
      "term": "Term Name",
      "definition": "Matching description or rule"
    }}
  ]
}}

If game_type == 'blanks':
{{
  "title": "Fill in the Blanks",
  "questions": [
    {{
      "id": 1,
      "sentence": "Sentence with ___ for the missing term.",
      "answer": "missing term",
      "hint": "Clue for the word",
      "topic": "Topic Name"
    }}
  ]
}}

If game_type == 'boss':
{{
  "title": "Boss Battle Challenge",
  "bossName": "Grand Master of Concepts",
  "bossHp": 100,
  "questions": [
    {{
      "id": 1,
      "question": "Advanced synthesis question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "damage": 25,
      "topic": "Topic Name",
      "explanation": "Master level explanation"
    }}
  ]
}}

Generate exactly {num_questions} items.
"""

    response = model.generate_content(prompt)
    raw_text = response.text.strip()
    
    # Strip json markdown markers if present
    raw_text = re.sub(r'^```json\s*', '', raw_text, flags=re.IGNORECASE)
    raw_text = re.sub(r'^```\s*', '', raw_text)
    raw_text = re.sub(r'\s*```$', '', raw_text)
    
    parsed = json.loads(raw_text)
    return parsed

def generate_fallback_content(text_content, game_type, num_questions, concepts):
    """
    Generates intelligent rule-based game content directly from text when API key is not present.
    """
    sentences = [s.strip() for s in re.split(r'[.!?]\s+', text_content) if len(s.strip()) > 30]
    if not sentences:
        sentences = [
            "Fundamental concepts form the cornerstone of subject mastery.",
            "Key principles enable problem solving and real-world application.",
            "Active recall and gamified learning significantly increase retention.",
            "Continuous evaluation identifies weak topics for targeted revision."
        ]
        
    concepts = concepts or ["Core Subject", "Fundamentals", "Applications", "Analysis"]

    if game_type == 'quiz':
        questions = []
        for i in range(min(num_questions, max(4, len(sentences)))):
            sent = sentences[i % len(sentences)]
            words = [w.strip(',.;:') for w in sent.split() if len(w) > 4]
            target_word = words[0] if words else "Concept"
            
            topic = concepts[i % len(concepts)]
            q_text = f"Regarding '{topic}', which statement accurately reflects the study material?"
            
            correct_opt = sent[:120]
            wrong1 = f"It denies the role of {target_word} in system architecture."
            wrong2 = f"It states that {target_word} has no measurable practical effect."
            wrong3 = f"It asserts that {topic} is only applicable to theoretical models."
            
            opts = [correct_opt, wrong1, wrong2, wrong3]
            random.shuffle(opts)
            c_idx = opts.index(correct_opt)
            
            questions.append({
                "id": i + 1,
                "question": q_text,
                "options": opts,
                "correctIndex": c_idx,
                "topic": topic,
                "explanation": f"According to the notes: '{sent}'"
            })
        return {"title": "AI Study Material Quiz", "questions": questions}

    elif game_type == 'flashcards':
        cards = []
        for i in range(min(num_questions, len(concepts))):
            topic = concepts[i % len(concepts)]
            sent = sentences[i % len(sentences)]
            cards.append({
                "id": i + 1,
                "front": f"What is the key takeaway regarding '{topic}'?",
                "back": sent,
                "hint": f"Think about {topic.lower()} definitions and applications.",
                "topic": topic
            })
        return {"title": "Flashcards Memory Deck", "cards": cards}

    elif game_type == 'matching':
        pairs = []
        for i in range(min(num_questions, len(concepts))):
            topic = concepts[i % len(concepts)]
            sent = sentences[i % len(sentences)]
            pairs.append({
                "id": i + 1,
                "term": topic,
                "definition": sent[:90] + ("..." if len(sent) > 90 else "")
            })
        return {"title": "Concept Matching Challenge", "pairs": pairs}

    elif game_type == 'blanks':
        q_list = []
        for i in range(min(num_questions, len(sentences))):
            sent = sentences[i]
            words = [w.strip(',.;:()') for w in sent.split() if len(w) > 4]
            if words:
                target = words[len(words)//2]
                blank_sent = sent.replace(target, "___", 1)
                q_list.append({
                    "id": i + 1,
                    "sentence": blank_sent,
                    "answer": target.lower(),
                    "hint": f"Starts with '{target[0]}', {len(target)} letters",
                    "topic": concepts[i % len(concepts)]
                })
        return {"title": "Fill in the Blanks", "questions": q_list}

    elif game_type == 'boss':
        boss_q = []
        for i in range(min(num_questions, 4)):
            topic = concepts[i % len(concepts)]
            sent = sentences[i % len(sentences)]
            opts = [
                f"Synthesize {topic} principles: {sent[:80]}",
                f"Ignore {topic} rules and apply baseline default parameters",
                f"Isolate {topic} from external variables without testing",
                f"Replace {topic} entirely with static manual procedures"
            ]
            boss_q.append({
                "id": i + 1,
                "question": f"BOSS STAGE {i+1}: How do you master {topic} in practical scenarios?",
                "options": opts,
                "correctIndex": 0,
                "damage": 25,
                "topic": topic,
                "explanation": f"Mastery requirement: {sent}"
            })
        return {
            "title": "Boss Battle: Knowledge Guardian",
            "bossName": "Cyber Titan",
            "bossHp": 100,
            "questions": boss_q
        }
