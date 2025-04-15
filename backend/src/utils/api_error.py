class ApiError(Exception):
    def __init__(self, status_code, message="Something went wrong", errors=None, stack=""):
        super().__init__(message)
        self.status_code = status_code
        self.message = message
        self.data = None
        self.success = False
        self.errors = errors or []

        if stack:
            self.stack = stack
        else:
            import traceback
            self.stack = traceback.format_exc()
