# Database & Storage Backup Strategy

## 1. Supabase Automated Backups
Your Supabase project automatically performs daily backups.
- **Free Tier**: Daily backups retained for 24 hours.
- **Pro Tier (Recommended)**: Daily backups retained for 7 days.
- **Enterprise**: Daily backups retained for 30 days.

## 2. Point-In-Time Recovery (PITR)
For an e-commerce platform handling orders and payments, **Point-In-Time Recovery (PITR)** is highly recommended.
- If upgrading to the Pro tier + PITR add-on, Supabase will log every single WAL (Write-Ahead Log) transaction.
- You can restore your database to the exact second right before a catastrophic failure (e.g., restoring orders right before a mistaken admin deletion).

## 3. Manual Logical Backups
As an additional safety measure, you should perform weekly manual logical backups (pg_dump).
To do this using the Supabase CLI:
```bash
supabase db dump -f db_backup_$(date +%F).sql --linked
```
Store these SQL dumps in a secure, encrypted, off-site storage bucket (e.g., AWS S3 Glacier or Google Cloud Storage).

## 4. Storage Bucket Backups
Supabase Storage (where product images and banners are kept) is backed by AWS S3, which has extremely high durability. However, accidental deletions (fat fingers) can happen.
- Enable S3 Versioning if migrating away from Supabase Storage.
- Alternatively, write a cron job that uses the Supabase Storage API to periodically sync your buckets to a local NAS or secondary cloud provider.

## 5. Recovery Plan
If a database corruption occurs:
1. Put the Next.js app in Maintenance Mode (deploy an `app/layout.tsx` that returns a generic "Under Maintenance" screen).
2. Go to Supabase Dashboard -> Database -> Backups.
3. Select the latest healthy snapshot and click "Restore".
4. Once restored, verify the `orders` and `cart_items` tables against your Razorpay dashboard logs to manually reconcile any orders placed between the backup timestamp and the crash timestamp.
5. Take the site out of Maintenance Mode.
