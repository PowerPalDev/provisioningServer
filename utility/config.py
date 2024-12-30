from dotenv import load_dotenv
import os
from typing import Optional

class Config:
    _instance = None
    
    # Database
    database_url: Optional[str]
    
    # MQTT Settings
    mqtt_enabled: bool
    mqtt_address: str
    mqtt_port: int
    mqtt_user: Optional[str]
    mqtt_password: Optional[str]
    
    # JWT Settings
    secret_key: Optional[str]
    algorithm: str
    access_token_expire_minutes: int
    
    # Device Settings
    device_auto_add: bool
    
    # Logging Settings
    save_log_db: bool

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Config, cls).__new__(cls)
            cls._instance._load_config()
        return cls._instance

    def _load_config(self):
        load_dotenv()
        
        # Database
        self.database_url = os.getenv('DATABASE_URL')

        # MQTT Settings
        self.mqtt_enabled = os.getenv('MQTT_ENABLED', 'false').lower() == 'true'
        self.mqtt_address = os.getenv('MQTT_ADDRESS', 'localhost')
        self.mqtt_port = int(os.getenv('MQTT_PORT', '1883'))
        self.mqtt_user = os.getenv('MQTT_USER')
        self.mqtt_password = os.getenv('MQTT_PASSWORD')

        # JWT Settings
        self.secret_key = os.getenv('SECRET_KEY')
        self.algorithm = os.getenv('ALGORITHM', 'HS256')
        self.access_token_expire_minutes = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '30'))

        # Device Settings
        self.device_auto_add = os.getenv('DEVICE_AUTO_ADD', 'false').lower() == 'true'

        # Logging Settings
        self.save_log_db = os.getenv('SAVE_LOG_DB', 'false').lower() == 'true'

    def get(self, key: str, default=None):
        """Get a configuration value by key"""
        return getattr(self, key.lower(), default)

    def __getitem__(self, key: str):
        """Allow dictionary-style access to config values"""
        return getattr(self, key.lower())

# Create a singleton instance
config = Config()

def conf():
    """Helper function to get the config singleton instance"""
    return config

