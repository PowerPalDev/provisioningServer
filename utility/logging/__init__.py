from enum import Enum
import traceback
import datetime
from typing import Optional

class Category(Enum):
    USER = "USER"
    MQTT = "MQTT"
    DEVICE = "DEVICE"

class LogLevel(Enum):
    DEBUG = 10
    INFO = 20
    WARNING = 30
    ERROR = 40
    CRITICAL = 50

class Logger:
    """
    Logger class for logging messages with different categories and levels
    """
    stackOn = True
    def __init__(self):
        self.logs = []  # You might want to replace this with a proper storage solution

    def _log(self, 
             level: LogLevel, 
             category: Category, 
             sub: str, 
             message: str, 
             detail: Optional[str] = None,
             stack_trace: Optional[str] = None,
             ip_address: Optional[str] = None) -> None:
        """
        Internal logging method that handles the actual logging logic
        """
        timestamp = datetime.datetime.now().isoformat()
        if self.stackOn:
            if stack_trace is None:
                stack_trace = ''.join(traceback.format_stack()[:-1])

            if stack_trace and "starlette/middleware/base.py" in stack_trace:
                # Find the index where the starlette middleware trace starts
                start_idx = stack_trace.find('File "/home/roy/Public2/provisioningServer/.venv/lib64/python3.11/site-packages/starlette/middleware/base.py')
                if start_idx != -1:
                    # Only keep the trace from this point onwards
                    stack_trace = stack_trace[start_idx:]


        if detail is None:
            detail = "" # Ensure detail is always a string      
        if ip_address is None:
            ip_address = "" # Ensure ip_address is always a string


        log_entry = {
            'timestamp': timestamp,
            'level': level.name,
            'category': category.name,
            'sub': sub,
            'message': message,
            'detail': detail,
            'stack_trace': stack_trace,
            'ip_address': ip_address
        }
        
        # For now, just append to list - in production, you might want to:
        # - Write to file
        # - Send to logging service
        # - Store in database
        self.logs.append(log_entry)
        
        # Print to console for debugging
        ip_info = f" [{ip_address}]" if ip_address else ""
        print(f"[{timestamp}]{ip_info} {level.name} - {category.name}/{sub}: {message}")
        if detail:
            print(f"    {detail}")
        if stack_trace:
            print(f"    {stack_trace}")

    def debug(self, category: Category, sub: str, message: str, detail: Optional[str] = None, ip_address: Optional[str] = None):
        self._log(LogLevel.DEBUG, category, sub, message, detail, ip_address=ip_address)

    def info(self, category: Category, sub: str, message: str, detail: Optional[str] = None, ip_address: Optional[str] = None):
        self.stackOn = False
        self._log(LogLevel.INFO, category, sub, message, detail, ip_address=ip_address)
        self.stackOn = True

    def warning(self, category: Category, sub: str, message: str, detail: Optional[str] = None, ip_address: Optional[str] = None):
        self._log(LogLevel.WARNING, category, sub, message, detail, ip_address=ip_address)

    def error(self, category: Category, sub: str, message: str, detail: Optional[str] = None, ip_address: Optional[str] = None):
        self._log(LogLevel.ERROR, category, sub, message, detail, ip_address=ip_address)

    def critical(self, category: Category, sub: str, message: str, detail: Optional[str] = None, ip_address: Optional[str] = None):
        self._log(LogLevel.CRITICAL, category, sub, message, detail, ip_address=ip_address)

# Create a singleton instance
logger = Logger()

#from utility.logging import logger, Category

# Basic usage
#logger.info(Category.USER, "login", "User logged in successfully")

# With detailed information#
#logger.error(
#    category=Category.MQTT, 
#    sub="connection", 
#    message="Failed to connect to broker",
#    detail="Connection timeout after 30 seconds"
#)