class ApiResponse:
    def __init__(self, status_code, data=None, message="Success"):
        self.status_code = status_code
        self.message = message
        self.data = data
        self.success = 200 <= status_code < 300

    def to_dict(self):
        return {
            "statusCode": self.status_code,
            "message": self.message,
            "data": self.data,
            "success": self.success
        }
