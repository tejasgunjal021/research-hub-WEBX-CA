from src.app import app

import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    try:
        print(f"Server is running on port {port}")
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        print("Error in server:", e)
