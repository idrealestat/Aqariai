/**
 * 🔌 API - إدارة العقارات (Offers)
 * 
 * ⚠️ TEMPORARILY DISABLED
 * This API is temporarily disabled because sampleOffersData.ts has been removed.
 * Will be re-implemented when the offers system is restored.
 */

interface Request {
  method: string;
  url: string;
  body?: any;
  query?: Record<string, string>;
}

interface Response {
  status: (code: number) => {
    json: (data: any) => void;
  };
}

export default async function handler(req: Request, res: Response) {
  return res.status(503).json({
    success: false,
    error: 'Offers API temporarily unavailable',
    message: 'نظام العقارات معطل مؤقتاً - سيتم استعادته قريباً'
  });
}
