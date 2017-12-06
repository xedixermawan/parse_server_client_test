from locust import HttpLocust, TaskSet, task
from random import randint
import random
import json
import time
from datetime import datetime
#import dateutil.parser

application_id = "myApphaha123"
master_key = "myKeyhaha123"

class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()

        return json.JSONEncoder.default(self, o)

class UserBehavior(TaskSet):
    @task(25)
    def getsleep(self):
        self.client.verify = False
        return self.client.get("/classes/Sleep", headers = {"X-Parse-Application-Id": application_id, "X-Parse-Master-Key": master_key} )

    @task(50)
    def savesleep(self):
        self.client.verify = False
        user_id = "AHA." + str(randint(0, 100000));
        payloads={"user_id": user_id, "polyphasic": True, "sleep_quality": "GOOD", "sleep_time": 9, "metadata": {"platform": "android", "app_version": 23, "schema_version": "3"} };

        return self.client.post("/classes/Sleep", data=json.dumps(payloads,cls=DateTimeEncoder),headers={"X-Parse-Application-Id": application_id, "X-Parse-Master-Key": master_key,"content-type": "application/json"} )

    def on_start(self):
        self.client.verify = False

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000
    max_wait = 9000