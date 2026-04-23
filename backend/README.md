# MoX Backend

This backend is a Django + Django REST Framework content service for the public MoX website.

## Why this stack

- Secure admin panel out of the box via Django admin
- Clean role-based extension path for sub-admins and club managers
- Straightforward PostgreSQL deployment on the existing Hetzner server
- Easy media uploads for events, clubs, and leadership profiles
- Natural Resend integration for contact acknowledgements and admin replies

## Content areas

- Events
- Leadership members
- Clubs
- Contact messages
- Users with MoX roles

## Immediate next steps

1. Install dependencies and create the initial database.
2. Create the first superuser for the admin panel.
3. Configure Resend SMTP so contact confirmations and admin replies send correctly.
4. Deploy behind Caddy on the Hetzner server with HTTPS only.
5. Add role-aware admin restrictions for club managers.

## Local setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_mox_site
python manage.py createsuperuser
python manage.py runserver
```

## What already works

- Django admin for events, clubs, leadership, and messages
- Audit logging for admin-side content changes and contact replies
- Contact endpoint honeypot protection and rate limiting
- Upload restrictions for images and files
- Admin IP allowlisting support
- Public API endpoints:
  - `/api/events/`
  - `/api/leadership/`
  - `/api/clubs/`
  - `/api/contact/messages/`
- Contact form submission persistence
- Contact confirmation email on submission
- Admin reply via Django admin using the `admin_reply` field

## Suggested production environment variables

```env
MOX_BACKEND_SECRET_KEY=change-me
MOX_BACKEND_DEBUG=0
MOX_BACKEND_ALLOWED_HOSTS=moxpolytechnique.com,www.moxpolytechnique.com,localhost,127.0.0.1
MOX_FRONTEND_ORIGINS=https://moxpolytechnique.com,https://www.moxpolytechnique.com,http://localhost:5173
MOX_BACKEND_DB_ENGINE=django.db.backends.postgresql
MOX_BACKEND_DB_NAME=mox
MOX_BACKEND_DB_USER=mox
MOX_BACKEND_DB_PASSWORD=change-me
MOX_BACKEND_DB_HOST=127.0.0.1
MOX_BACKEND_DB_PORT=5432
MOX_CONTACT_RATE_LIMIT=5/hour
MOX_MAX_UPLOAD_SIZE_BYTES=5242880
MOX_SECURE_SSL_REDIRECT=1
MOX_ENABLE_HSTS=1
MOX_SECURE_REFERRER_POLICY=strict-origin-when-cross-origin
MOX_SECURE_CROSS_ORIGIN_OPENER_POLICY=same-origin
MOX_ADMIN_IP_ALLOWLIST=YOUR_OFFICE_IP/32,YOUR_HOME_IP/32
```

## Security and operations notes

- Use PostgreSQL on Hetzner for production, not SQLite.
- Keep `MOX_BACKEND_DEBUG=0` in production.
- Run `python manage.py seed_mox_site` only to create missing starter content.
- Use `python manage.py seed_mox_site --refresh-defaults` only if you intentionally want to overwrite seeded defaults.
- Restrict `/admin/` with `MOX_ADMIN_IP_ALLOWLIST` whenever possible.
- Configure strong admin passwords and keep Resend credentials only in server-side env files.

## Backups

- Database: schedule nightly PostgreSQL dumps with `pg_dump`
- Media: back up `media/`
- Environment: back up `.env`
- Keep backups off the application disk if possible
