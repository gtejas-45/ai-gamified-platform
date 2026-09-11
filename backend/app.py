import os
from flask import Flask
from flask_cors import CORS
from config import Config
from utils.helpers import success_response, error_response

# Import Route Blueprints
from routes.auth_routes import auth_bp
from routes.upload_routes import upload_bp
from routes.ai_routes import ai_bp
from routes.analytics_routes import analytics_bp
from routes.report_routes import report_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes (specifically allowing React frontend origin)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register API Blueprints under /api prefix
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(ai_bp, url_prefix='/api')
    app.register_blueprint(analytics_bp, url_prefix='/api')
    app.register_blueprint(report_bp, url_prefix='/api')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return success_response({
            "status": "healthy",
            "service": "AI Gamified Learning Platform API",
            "gemini_api_configured": bool(os.getenv('GEMINI_API_KEY'))
        }, "Backend server is running smoothly.")

    @app.errorhandler(404)
    def not_found(e):
        return error_response("API endpoint not found", 404)

    @app.errorhandler(500)
    def internal_error(e):
        return error_response("Internal server error", 500)

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"Starting AI Gamified Learning Platform Backend Server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
