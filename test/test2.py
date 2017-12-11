from locust import HttpLocust, TaskSet, task
from random import randint
import random
import json
import time
from datetime import datetime
import resource
#import dateutil.parser

application_id = "myApphaha123"
master_key = "myKeyhaha123"

class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()

        return json.JSONEncoder.default(self, o)

class UserBehavior(TaskSet):
    @task(2)
    def getsleep(self):
        self.client.verify = False
        return self.client.get("/classes/Sleep", headers = {"X-Parse-Application-Id": application_id, "X-Parse-Master-Key": master_key} )

    @task(1)
    def savesleep(self):
        self.client.verify = False
        usernamec = ["SENSE", "EDIE", "BOZ", "RO", "MACHINE","GIT"]
        sleepqs = ["VERY GOOD", "GOOD", "AVG", "BAD", "NIGHMARE"]
        platform = ["Android", "iOS", "Web", "Desktop", "WP"]
        pol = [ True, False]
        user_id = random.choice(usernamec)+"." + str(randint(1, 20));

        # 1 jan 2017 - 31 des 2018
        t1 = randint(1483228801,1546214401); 
        t2 = t1 + randint(56400,86400);

        t1_date = datetime.fromtimestamp(t1);
        t1_str = t1_date.isoformat()+ ".000Z";

        t2_date = datetime.fromtimestamp(t2);
        t2_str = t2_date.isoformat()+ ".000Z";
        payloads={"user_id": user_id, "start_time":{"__type": "Date", "iso": t1_str},"end_time":{"__type": "Date", "iso": t2_str},"polyphasic": random.choice(pol), "sleep_quality": random.choice(sleepqs), "sleep_time": randint(1, 15), "metadata": {"platform": random.choice(platform), "app_version": randint(1, 10), "schema_version": str(randint(1, 5))} };

        return self.client.post("/classes/Sleep", data=json.dumps(payloads,cls=DateTimeEncoder),headers={"X-Parse-Application-Id": application_id, "X-Parse-Master-Key": master_key,"content-type": "application/json"} )

    def on_start(self):
        self.client.verify = False

class WebsiteUser(HttpLocust):
    resource.setrlimit(resource.RLIMIT_NOFILE, (10000, resource.RLIM_INFINITY))
    task_set = UserBehavior
    min_wait = 500
    max_wait = 2000