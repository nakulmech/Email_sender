export class StatsManager {
  constructor(emailService, statsIds) {
    this.emailService = emailService;
    this.statsElements = {
      totalSent: document.getElementById(statsIds.totalSent),
      totalSuccess: document.getElementById(statsIds.totalSuccess),
      totalFailure: document.getElementById(statsIds.totalFailure),
      totalRetries: document.getElementById(statsIds.totalRetries),
      providerA: document.getElementById(statsIds.providerA),
      providerB: document.getElementById(statsIds.providerB)
    };
    this.sentCount = 0;
    this.successCount = 0;
    this.failureCount = 0;
  }

  incrementSent(status) {
    this.sentCount++;
    if (status === 'success') this.successCount++;
    else if (status === 'failure') this.failureCount++;
    this.updateDisplay();
  }

  updateDisplay() {
    this.statsElements.totalSent.textContent = this.sentCount;
    this.statsElements.totalSuccess.textContent = this.successCount;
    this.statsElements.totalFailure.textContent = this.failureCount;
    this.statsElements.totalRetries.textContent = this.emailService.stats.retries;
    this.statsElements.providerA.textContent = this.emailService.stats.providerA;
    this.statsElements.providerB.textContent = this.emailService.stats.providerB;
  }

  initializeCountsFromLogs(logData) {
    this.sentCount = logData.length;
    this.successCount = logData.filter(e => e.status === 'success').length;
    this.failureCount = logData.filter(e => e.status === 'failure').length;
    this.updateDisplay();
  }
}