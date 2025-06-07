import { EmailService } from './EmailService.js';
import { Logger } from './Logger.js';
import { StatsManager } from './StatsManager.js';

const emailTemplates = [
  { name: "Meeting Invite", subject: "Meeting Invitation", content: "Dear colleague,\n\nI would like to invite you to a meeting..." },
  { name: "Thank You Note", subject: "Thank You!", content: "Hi there,\n\nThank you for your assistance..." },
  { name: "Follow-Up", subject: "Checking In", content: "Hello,\n\nJust following up on my previous email..." }
];

const emailService = new EmailService();
const logger = new Logger('logViewer');
const statsManager = new StatsManager(emailService, {
  totalSent: 'totalSent',
  totalSuccess: 'totalSuccess',
  totalFailure: 'totalFailure',
  totalRetries: 'totalRetries',
  providerA: 'providerA',
  providerB: 'providerB'
});
statsManager.initializeCountsFromLogs(logger.getLogData());


const templateSelect = document.getElementById('templateSelect');
emailTemplates.forEach((temp, idx) => {
  const option = document.createElement('option');
  option.value = idx;
  option.textContent = temp.name;
  templateSelect.appendChild(option);
});

templateSelect.addEventListener('change', () => {
  const idx = templateSelect.value;
  if (idx !== "") {
    const tmpl = emailTemplates[idx];
    document.getElementById('subject').value = tmpl.subject;
    document.getElementById('content').value = tmpl.content;
  }
});

// Handle form submit
const form = document.getElementById('emailForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = {
    to: document.getElementById('toEmail').value,
    subject: document.getElementById('subject').value,
    content: document.getElementById('content').value,
    attachment: document.getElementById('attachment').value
  };

  
  logger.addLog({ message: `Sending email to ${email.to}...`, status: 'info' });
  console.log('Form submitted:', email);

  const result = await emailService.sendEmail(email);
  const { status, provider, message } = result;

  const entry = {
    time: new Date().toLocaleTimeString(),
    to: email.to,
    subject: email.subject,
    provider: provider || '',
    status: status,
    info: message || ''
  };

  logger.addLog(entry);
  statsManager.incrementSent(status);
});
