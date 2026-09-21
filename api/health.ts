import { handleCors } from './lib/cors.js';
import { getActivePersistenceProvider } from './lib/persistence.js';

export default function handler(req: any, res: any) {
  const corsProceed = handleCors(req, res);
  if (!corsProceed) {
    return;
  }

  const activeProvider = getActivePersistenceProvider();

  return res.status(200).json({
    status: 'healthy',
    service: 'rajdeep-enterprises-api',
    persistence: {
      configured: Boolean(activeProvider),
      provider: activeProvider?.name || 'none (configure KV or Webhook)',
    },
    timestamp: new Date().toISOString(),
  });
}
