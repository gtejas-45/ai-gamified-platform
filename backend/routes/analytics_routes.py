from flask import Blueprint, request
from ml.weakness_detector import analyze_student_performance
from utils.helpers import success_response, error_response

analytics_bp = Blueprint('analytics', __name__)

# Store session logs in-memory
SESSION_LOGS = []

@analytics_bp.route('/analytics/weakness', methods=['POST'])
def get_weakness_analysis():
    """
    Runs ML model on student game attempt logs to calculate mastery score,
    identify weak topics, risk levels, and generate personalized revision paths.
    """
    data = request.json or {}
    game_sessions = data.get('sessions', [])
    
    if not game_sessions and SESSION_LOGS:
        game_sessions = SESSION_LOGS

    analysis_result = analyze_student_performance(game_sessions)
    return success_response(analysis_result, "ML performance and weakness analysis completed")

@analytics_bp.route('/analytics/log-session', methods=['POST'])
def log_game_session():
    """
    Logs gameplay results (correct/wrong answers, time spent per question, topic tags).
    """
    data = request.json or {}
    logs = data.get('logs', [])
    if isinstance(logs, list):
        SESSION_LOGS.extend(logs)
    elif isinstance(logs, dict):
        SESSION_LOGS.append(logs)
        
    return success_response({"total_logged": len(SESSION_LOGS)}, "Gameplay session logged")

@analytics_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """
    Returns student rankings & XP leaderboard.
    """
    leaderboard = [
        {"rank": 1, "name": "Aarav Patil", "school": "GPH Kolhapur", "xp": 4850, "streak": 12, "badge": "Master Scholar"},
        {"rank": 2, "name": "Priya Sharma", "school": "Z.P. High School", "xp": 4620, "streak": 10, "badge": "Speed Demon"},
        {"rank": 3, "name": "Rohan Deshmukh", "school": "Govt High School", "xp": 4310, "streak": 8, "badge": "Boss Slayer"},
        {"rank": 4, "name": "Ananya Kulkarni", "school": "Rural Tech Academy", "xp": 3980, "streak": 7, "badge": "Concept Guru"},
        {"rank": 5, "name": "Tejas Gaikwad", "school": "Engineering Institute", "xp": 3750, "streak": 6, "badge": "Rising Star"}
    ]
    return success_response({"leaderboard": leaderboard}, "Leaderboard retrieved")
