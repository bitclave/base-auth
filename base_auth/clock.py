import subprocess
from apscheduler.schedulers.blocking import BlockingScheduler

scheduler = BlockingScheduler()


# @scheduler.scheduled_job('interval', seconds=63)
# def example():
#     subprocess.call('python manage.py example', shell=True, close_fds=True)


scheduler.start()
