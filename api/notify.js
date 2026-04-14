import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

webpush.setVapidDetails(
  'mailto:hello@thelist.nyc',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { title, body, excludeUsername } = req.body;

  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('subscription, username')
    .neq('username', excludeUsername || '');

  if (error) return res.status(500).json({ error: error.message });

  const payload = JSON.stringify({ title, body, url: '/' });

  const results = await Promise.allSettled(
    (subs || []).map(row =>
      webpush.sendNotification(row.subscription, payload)
    )
  );

  const failed = results.filter(r => r.status === 'rejected').length;
  res.status(200).json({ sent: results.length - failed, failed });
}
