#we should probably use https://fastapi.tiangolo.com/advanced/events/ to avoid reconnecting each time
import paho.mqtt.client as mqtt
import os

#read from env variables and connect to the mqtt broker
def get_mqtt_client():
    mqtt_broker = os.getenv("MQTT_ADDRESS", "localhost")
    mqtt_port = int(os.getenv("MQTT_PORT", 1883))
    mqtt_username = os.getenv("MQTT_USER")
    mqtt_password = os.getenv("MQTT_PASSWORD")
    client = mqtt.Client()
    client.connect(mqtt_broker, mqtt_port, 60)
    client.username_pw_set(mqtt_username, mqtt_password)
    client.loop_start()
    return client



