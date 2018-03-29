import os

if 'SLACK_INCOMING_WEBHOOK_URL' in os.environ:
    SLACK_INCOMING_WEBHOOK_URL = os.environ['SLACK_INCOMING_WEBHOOK_URL']
else:
    SLACK_INCOMING_WEBHOOK_URL = None
