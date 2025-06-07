Email Sender  -  JavaScript

This is a  project I built to simulate sending emails from the browser.
The main goal was to learn how to implement reliable sending with retries, fallback, and avoid duplicate sends — all using only plain JavaScript, HTML, and CSS.

How to Run

1. Download the project folder.


2. Just open index.html in your browser (Chrome, Firefox, etc).


3. No backend or server is needed — everything runs in the browser itself.



How it works

You can fill the email form and send emails (simulated).

The app tries to send using Provider A first. If it fails, it switches to Provider B.

If sending fails, it retries automatically with increasing delay (exponential backoff).

It won’t send the same email twice (idempotency is used).

A simple queue ensures only one email is processed at a time (rate limiting).

All status logs and stats are shown on the page and saved in localStorage — so they stay even after page reload.


Notes:

No real emails are sent — the "send" success/failure is randomized for learning.

Attachments are simulated (just a filename input — no actual file upload).