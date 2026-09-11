from flask import Blueprint, request, make_response
from services.pdf_generator import generate_performance_pdf
from ml.weakness_detector import analyze_student_performance
from utils.helpers import error_response

report_bp = Blueprint('report', __name__)

@report_bp.route('/report/download', methods=['POST', 'GET'])
def download_pdf_report():
    """
    Generates and downloads a clean PDF performance report for students, teachers, and parents.
    """
    if request.method == 'POST':
        data = request.json or {}
    else:
        data = {}

    student_name = data.get('studentName', 'Student User')
    file_name = data.get('fileName', 'Study Material')
    sessions = data.get('sessions', [])

    analytics_data = analyze_student_performance(sessions)

    try:
        pdf_bytes = generate_performance_pdf(
            student_name=student_name,
            analytics_data=analytics_data,
            file_name=file_name
        )

        response = make_response(pdf_bytes)
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = f'attachment; filename=AI_Learning_Report_{student_name.replace(" ", "_")}.pdf'
        return response

    except Exception as e:
        return error_response(f"Failed to generate PDF report: {str(e)}", 500)
