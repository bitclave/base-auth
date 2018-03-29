from typing import List, Dict

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_mail(subject: str, template: str, context: Dict, to: List[str]):
    template_name = template.split('/')[-1]

    text_template = '{}/{}.txt'.format(template, template_name)
    text_body = render_to_string(text_template, context)

    html_template = '{}/{}.html'.format(template, template_name)
    html_body = render_to_string(html_template, context)

    from_email = settings.DEFAULT_FROM_EMAIL
    reply_to = (settings.SUPPORT_EMAIL,)

    message = EmailMultiAlternatives(
        subject=subject,
        from_email=from_email,
        to=to,
        reply_to=reply_to,
        body=text_body,
        alternatives=[(html_body, 'text/html')]
    )
    message.send()
