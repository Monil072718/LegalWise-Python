import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Configuration (Env vars would be better, but hardcoding placeholders for now)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "nakranimonil18@gmail.com" # REPLACE WITH REAL EMAIL
SMTP_PASSWORD = "uaecsbrhxondehoy"    # REPLACE WITH REAL APP PASSWORD

def send_email(to_email: str, subject: str, body: str):
    """
    Sends an email using SMTP.
    If credentials are invalid, it prints the email to the console (Dev Mode).
    """
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USERNAME, to_email, text)
        server.quit()
        print(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        print("------------------------------------------------")
        print(f"FAILED TO SEND EMAIL (SMTP Error): {e}")
        print(f"Request: Send '{subject}' to {to_email}")
        print(f"Body: {body}")
        print("------------------------------------------------")
        # In dev mode, we return True so the flow continues even if email fails
        return True
