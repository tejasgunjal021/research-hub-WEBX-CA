from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from src.extensions import mongo
from src.routes.user_routes import user_bp
from src.config import MONGO_URI, CORS_ORIGIN
import os

load_dotenv()

app = Flask(__name__, static_folder="../client/build", static_url_path="/")

# Configuration
app.config["MONGO_URI"] = MONGO_URI
mongo.init_app(app)

# Enable CORS
CORS(app, supports_credentials=True, origins=[CORS_ORIGIN])

# Register blueprints
app.register_blueprint(user_bp, url_prefix="/api/users")

# Serve React build
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")
