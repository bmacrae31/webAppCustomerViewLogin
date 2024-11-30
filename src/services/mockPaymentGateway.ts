export class PaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentError';
  }
}

export const processMockPayment = async (amount: number): Promise<boolean> => {
  // Simulate network latency (500-1500ms)
  const delay = Math.random() * 1000 + 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // 90% success rate
  const isSuccessful = Math.random() > 0.1;

  if (!isSuccessful) {
    throw new PaymentError('Payment processing failed');
  }

  return true;
};