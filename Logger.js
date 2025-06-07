export class Logger {
  constructor(logViewerId) {
    this.logViewer = document.getElementById(logViewerId);
    this.logData = JSON.parse(localStorage.getItem('emailLogs') || '[]');
    this.renderLogs();
  }

  renderLogs() {
    this.logData.forEach(entry => this.appendLogEntry(entry));
  }

  appendLogEntry(entry) {
    const div = document.createElement('div');
    div.classList.add('log-entry');
    if (entry.status === 'success') div.classList.add('success');
    else if (entry.status === 'failure') div.classList.add('failure');
    else div.classList.add('info');

    let msg = `[${entry.time || new Date().toLocaleTimeString()}] `;
    if (entry.to) msg += `To: ${entry.to}, `;
    if (entry.provider) msg += `Provider: ${entry.provider}, `;
    msg += `Status: ${entry.status}`;
    if (entry.info) msg += ` - ${entry.info}`;
    div.textContent = msg;

    this.logViewer.appendChild(div);
    this.logViewer.scrollTop = this.logViewer.scrollHeight;
  }

  addLog(entry) {
    this.logData.push(entry);
    localStorage.setItem('emailLogs', JSON.stringify(this.logData));
    this.appendLogEntry(entry);
  }

  getLogData() {
    return this.logData;
  }
}
