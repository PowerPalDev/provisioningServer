from backend.schemas import Device
from utility.mqtt_client import get_mqtt_client

#extend the device class with the shelly specific properties
class ShellyDevice(Device):

    #add a function to toggle the device
    def toggle(self, state: bool):
        #send the command to the device, is a mqtt command
        #mosquitto_pub -h ${MQTT_SERVER} -t ${DEVICE_TOPIC}/rpc -m '{method":"Switch.Set", "params":{"id":0,"on":true}}'
        client = get_mqtt_client()
        topic = f"{self.compose_topic()}/rpc"
        message = f'{{"method":"Switch.Set", "params":{{"id":0,"on":{state}}}}}'
        return client.publish(topic, message)

