#this is a singleton that will connect to the mqtt broker and keep it alive
#connection will happen on the first call, because we run under multiprocessing, and not multithreading is fine

import paho.mqtt.client as mqtt
import os
from utility.logging import logger, Category

#we should merge a bit the logic between this and the one on in the simulator
class MQTTClientSingleton:
    _instance = None
    _client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MQTTClientSingleton, cls).__new__(cls)
            cls._instance._initialize_client()
        return cls._instance
    
    def _on_connect(self, client, userdata, flags, rc):
        connection_codes = {
            0: "Connected successfully",
            1: "Incorrect protocol version",
            2: "Invalid client identifier",
            3: "Server unavailable",
            4: "Bad username or password",
            5: "Not authorized"
        }
        status = connection_codes.get(rc, f"Unknown error (code: {rc})")
        logger.info(category=Category.MQTT, sub="connection", message=f"MQTT Connection status: {status}")

    #def _on_publish(self, client, userdata, mid):
        #we do not have the topic -.-, just the message id
        #logger.info(f"Message {mid} published successfully", category=Category.MQTT)

    def _on_disconnect(self, client, userdata, rc):
        if rc != 0:
            logger.warning(category=Category.MQTT, sub="connection", message=f"Unexpected MQTT disconnection (code: {rc}). Will auto-reconnect.")

    def publish(self, topic, payload):
        try:
            result = self._client.publish(topic, payload)
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                logger.info(
                    Category.MQTT, 
                    "publish", 
                    f"Message published successfully to {topic}",
                    detail=f"Payload: {payload}"
                )
                return True
            else:
                logger.error(
                    Category.MQTT,
                    "publish",
                    f"Failed to publish message to {topic}",
                    detail=f"Error code: {result.rc}, Payload: {payload}"
                )
                return False
        except Exception as e:
            logger.error(
                Category.MQTT,
                "publish",
                f"Exception while publishing to {topic}",
                detail=f"Error: {str(e)}, Payload: {payload}"
            )
            return False
        
    def _initialize_client(self):
        mqtt_broker = os.getenv("MQTT_ADDRESS", "localhost")
        mqtt_port = int(os.getenv("MQTT_PORT", 1883))
        mqtt_username = os.getenv("MQTT_USER")
        mqtt_password = os.getenv("MQTT_PASSWORD")

        self._client = mqtt.Client(protocol=mqtt.MQTTv311)
        # Set default QoS level to 1 for reliable delivery with confirmation
        self._client.qos = 1
        self._client.username_pw_set(mqtt_username, mqtt_password)
        
        # Set callbacks
        self._client.on_connect = self._on_connect
        #self._client.on_publish = self._on_publish
        self._client.on_disconnect = self._on_disconnect
        
        try:
            self._client.connect(mqtt_broker, mqtt_port, 60)
            self._client.loop_start()
        except Exception as e:
            logger.error(Category.MQTT, "connection", "Failed to connect to MQTT broker", detail=f"Error: {str(e)}")

    def get_client(self):
        return self

# Helper function to maintain backwards compatibility
def get_mqtt_client():
    return MQTTClientSingleton().get_client()



