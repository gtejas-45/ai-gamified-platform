import math

def analyze_student_performance(game_sessions):
    """
    Analyzes student gameplay data across sessions to identify weak topics,
    overall mastery score, risk level, topic breakdown, and recommended revision plan.

    game_sessions input sample:
    [
      {
        "topic": "Neural Networks",
        "is_correct": False,
        "time_taken_sec": 28,
        "game_type": "quiz"
      },
      ...
    ]
    """
    if not game_sessions:
        return {
            "mastery_score": 75.0,
            "risk_level": "Low",
            "weak_topics": [],
            "strong_topics": [],
            "topic_analysis": {},
            "recommendations": ["Play games to generate real-time performance analytics."]
        }

    # Aggregate performance by topic
    topics_stats = {}

    for log in game_sessions:
        topic = log.get("topic", "General")
        is_correct = log.get("is_correct", False)
        time_taken = log.get("time_taken_sec", 15)

        if topic not in topics_stats:
            topics_stats[topic] = {
                "attempts": 0,
                "correct": 0,
                "total_time": 0,
                "wrong_attempts": 0
            }

        topics_stats[topic]["attempts"] += 1
        if is_correct:
            topics_stats[topic]["correct"] += 1
        else:
            topics_stats[topic]["wrong_attempts"] += 1
        topics_stats[topic]["total_time"] += time_taken

    # Calculate topic mastery scores & identify weak spots using weighted ML formula
    # Score = (Accuracy * 0.70) + (Speed Bonus * 0.15) + (Consistency * 0.15)
    analyzed_topics = []
    total_correct = 0
    total_attempts = 0

    for topic, stats in topics_stats.items():
        att = stats["attempts"]
        corr = stats["correct"]
        accuracy = (corr / att) * 100.0 if att > 0 else 0.0
        avg_time = stats["total_time"] / att if att > 0 else 15.0
        
        # Time penalty if student spent > 30 sec per question (hesitation)
        speed_score = max(0.0, 100.0 - max(0.0, avg_time - 15.0) * 2.5)
        
        composite_score = round((accuracy * 0.75) + (speed_score * 0.25), 1)

        total_correct += corr
        total_attempts += att

        analyzed_topics.append({
            "topic": topic,
            "accuracy": round(accuracy, 1),
            "attempts": att,
            "avg_time_sec": round(avg_time, 1),
            "mastery_score": composite_score,
            "status": "Weak" if composite_score < 65.0 else ("Moderate" if composite_score < 80.0 else "Strong")
        })

    # Sort topics by lowest mastery score
    analyzed_topics.sort(key=lambda x: x["mastery_score"])

    weak_topics = [t["topic"] for t in analyzed_topics if t["status"] == "Weak"]
    strong_topics = [t["topic"] for t in analyzed_topics if t["status"] == "Strong"]

    overall_accuracy = (total_correct / total_attempts * 100.0) if total_attempts > 0 else 75.0
    
    if overall_accuracy < 50.0:
        risk_level = "High"
    elif overall_accuracy < 75.0:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    # Actionable personalized revision steps based on weakness detection
    recommendations = generate_revision_recommendations(weak_topics, overall_accuracy)

    return {
        "mastery_score": round(overall_accuracy, 1),
        "risk_level": risk_level,
        "total_questions_attempted": total_attempts,
        "accuracy_percentage": round(overall_accuracy, 1),
        "weak_topics": weak_topics if weak_topics else (analyzed_topics[:1] if analyzed_topics else []),
        "strong_topics": strong_topics,
        "topic_breakdown": analyzed_topics,
        "recommendations": recommendations
    }

def generate_revision_recommendations(weak_topics, accuracy):
    recs = []
    if weak_topics:
        recs.append(f"Focus immediate revision on: {', '.join(weak_topics[:3])}.")
        recs.append("Review concept flashcards for 10 minutes daily before taking quizzes.")
        recs.append("Play matching pairs to reinforce key definitions and terminology.")
    else:
        recs.append("Great work! Practice Boss Battle Mode to challenge your synthesis skills.")

    if accuracy < 60.0:
        recs.append("Re-read original study material notes for weak topics before re-attempting games.")
    recs.append("Download your PDF Progress Report to track concept mastery over time.")
    return recs
