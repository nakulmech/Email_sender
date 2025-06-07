export class EmailService {
  constructor() {
    this.providers = [
      { name: 'Provider A', successRate: 0.7 },
      { name: 'Provider B', successRate: 0.9 }
    ];
    this.currentProviderIndex = 0;
    this.idempotencyMap = new Set();
    this.stats = {
      providerA: 0,
      providerB: 0,
      retries: 0
    };
  }

  sendViaProvider(email, providerIndex) {
    const provider = this.providers[providerIndex];
    console.log(`Attempting send via ${provider.name} (Rate: ${provider.successRate})`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < provider.successRate) {
          resolve(`${provider.name} sent successfully`);
        } else {
          reject(new Error(`${provider.name} failed to send`));
        }
      }, 500 + Math.random() * 500);
    });
  }

  async sendEmail(email) {
    const emailId = email.id || crypto.randomUUID();
    email.id = emailId;

    if (this.idempotencyMap.has(emailId)) {
      console.log('Duplicate send prevented by idempotency key.');
      return { status: 'skipped', message: 'Already sent' };
    }

    let attempt = 0;
    let delay = 1000;
    let providerIndex = this.currentProviderIndex;

    while (attempt < 5) {
      attempt++;
      try {
        if (providerIndex === 0) this.stats.providerA++;
        else this.stats.providerB++;

        const result = await this.sendViaProvider(email, providerIndex);
        console.log(`Success on attempt ${attempt}: ${result}`);
        this.idempotencyMap.add(emailId);
        return { status: 'success', provider: this.providers[providerIndex].name };
      } catch (err) {
        console.warn(`Attempt ${attempt} failed: ${err.message}`);
        this.stats.retries++;
        if (attempt === 3) {
          providerIndex = 1 - providerIndex;
          console.log(`Switching to fallback ${this.providers[providerIndex].name} after failures.`);
        }
        console.log(`Waiting ${delay}ms before retrying...`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      }
    }

    console.error('All send attempts failed.');
    return { status: 'failure', provider: this.providers[providerIndex].name };
  }
}
