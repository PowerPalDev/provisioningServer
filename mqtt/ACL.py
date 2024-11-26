import json
import os
from dotenv import load_dotenv
import paho.mqtt.client as mqtt
import time

# Load environment variables from .env file
load_dotenv()

# MQTT configuration from environment variables
MQTT_ENABLED = os.getenv('MQTT_ENABLED')
MQTT_ADDRESS = os.getenv('MQTT_ADDRESS')
MQTT_PORT = int(os.getenv('MQTT_PORT', 1883))  # Default to 1883 if not specified
MQTT_USER = os.getenv('MQTT_USER')
MQTT_PASSWORD = os.getenv('MQTT_PASSWORD')

def deleteMqttClient(username: str, client: mqtt.Client) -> bool:
    """
    Delete an MQTT client user using Dynamic Security
    """
    command = {
        "commands": [{
            "command": "deleteClient",
            "username": username
        }]
    }

    try:
        # Publish the delete client command
        result = client.publish('$CONTROL/dynamic-security/v1', json.dumps(command))
        print(f"Delete client result: {result.rc} for command: {command}")
        return result.rc == 0
    except Exception as e:
        print(f"Error deleting MQTT user: {str(e)}")
        return False

def create_mqtt_client(username: str, password: str, client: mqtt.Client) -> bool:
    """
    Create a new MQTT client user using Dynamic Security
    
    Args:
        username (str): Username to create
        password (str): Password for the user
    Returns:
        bool: Success status
    """
    command = {
        "commands": [{
            "command": "createClient",
            "username": username,
            "password": password
        }]
    }
    
    try:
        # Publish the create client command
        result = client.publish('$CONTROL/dynamic-security/v1', json.dumps(command))
        print(f"Create client result: {result.rc} for command: {command}")
        return result.rc == 0
    except Exception as e:
        print(f"Error creating MQTT user: {str(e)}")
        return False
    
def create_role(role_name: str, topic: str, client: mqtt.Client) -> bool:
    """
    Create a new role with publish permissions for a specific topic
    
    Args:
        role_name (str): Name of the role to create
        topic (str): Topic pattern to allow publishing to
    Returns:
        bool: Success status
    """
    command = {
        "commands": [{
            "command": "createRole",
            "rolename": role_name,
            "acls": [{
                "acltype": "publishClientSend",
                "topic": topic,
                "allow": True
            }]
        }]
    }
    
    try:       
        # Publish the create role command
        result = client.publish('$CONTROL/dynamic-security/v1', json.dumps(command))
        print(f"Create role result: {result.rc} for command: {command}")
        
        return result.rc == 0
    except Exception as e:
        print(f"Error creating role: {str(e)}")
        return False  

def assign_role_to_client(username: str, role_name: str, client: mqtt.Client) -> bool:
    """
    Assign a role to a client
    
    Args:
        username (str): Username of the client
        role_name (str): Name of the role to assign
    Returns:
        bool: Success status
    """
    command = {
        "commands": [{
            "command": "addClientRole",
            "username": username,
            "rolename": role_name
        }]
    }
    
    try:
        # Publish the assign role command
        result = client.publish('$CONTROL/dynamic-security/v1', json.dumps(command))
        print(f"Assign role result: {result.rc} for command: {command}")
        return result.rc == 0
    except Exception as e:
        print(f"Error assigning role: {str(e)}")
        return False

def register_and_enable_device(mac_address: str,username: str, password: str):
    if not MQTT_ENABLED:
        return
    
    # Initialize MQTT client
    client = mqtt.Client()
    # Set credentials for broker connection
    client.username_pw_set(MQTT_USER, MQTT_PASSWORD)

    try:
        # Connect to broker
        client.connect(MQTT_ADDRESS, MQTT_PORT)

        role_name = f"{username}_Publish"
        topic = f"user/{username}/#"

        #MQTT acl do not send back the response! For the moment is just easier to remove old use and create a new one
        deleteMqttClient(mac_address, client)
        create_mqtt_client(mac_address, password, client)
        assign_role_to_client(mac_address, role_name, client)

        client.disconnect()
        return True
    except Exception as e:
        print(f"Error registering device: {str(e)}")
        return False

def register_and_enable_user(username: str, password: str):
    if not MQTT_ENABLED:
        return

    """
    Register and enable a user for MQTT access
    
    Args:
        username (str): Username to register
        password (str): Password for the user
    """
    # Initialize MQTT client
    client = mqtt.Client()
    # Set credentials for broker connection
    client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
    
    try:
        # Connect to broker
        client.connect(MQTT_ADDRESS, MQTT_PORT)

        role_name = f"{username}_Publish"
        topic = f"user/{username}/#"
        
        create_role(role_name, topic, client)
        time.sleep(0.1)  # Add a small delay to ensure role creation is processed

        deleteMqttClient(username, client)
        time.sleep(0.1)
        create_mqtt_client(username, password, client)
        time.sleep(0.1)
        
        assign_role_to_client(username, role_name, client)
        
        client.disconnect()
        return True
        
    except Exception as e:
        print(f"Error registering user: {str(e)}")
        return False
