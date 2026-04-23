from __future__ import annotations
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def _load_env_file() -> None:
    env_path = BASE_DIR / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


_load_env_file()

SECRET_KEY = os.environ.get("MOX_BACKEND_SECRET_KEY", "change-me-before-production")
DEBUG = os.environ.get("MOX_BACKEND_DEBUG", "0") == "1"
ALLOWED_HOSTS = [host.strip() for host in os.environ.get("MOX_BACKEND_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if host.strip()]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "apps.users",
    "apps.content",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "apps.users.middleware.AdminIPAllowlistMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "apps.users.middleware.AdminSessionTimeoutMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("MOX_BACKEND_DB_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("MOX_BACKEND_DB_NAME", str(BASE_DIR / "db.sqlite3")),
        "USER": os.environ.get("MOX_BACKEND_DB_USER", ""),
        "PASSWORD": os.environ.get("MOX_BACKEND_DB_PASSWORD", ""),
        "HOST": os.environ.get("MOX_BACKEND_DB_HOST", ""),
        "PORT": os.environ.get("MOX_BACKEND_DB_PORT", ""),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 12}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

PASSWORD_HASHERS = []
try:
    import argon2  # noqa: F401

    PASSWORD_HASHERS.append("django.contrib.auth.hashers.Argon2PasswordHasher")
except ImportError:
    pass

PASSWORD_HASHERS += [
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Paris"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "users.User"

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "MOX_FRONTEND_ORIGINS",
        "http://localhost:5173,https://moxpolytechnique.com,https://www.moxpolytechnique.com",
    ).split(",")
    if origin.strip()
]

CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "contact_messages": os.environ.get("MOX_CONTACT_RATE_LIMIT", "5/hour"),
    },
}

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_HTTPONLY = False
SECURE_SSL_REDIRECT = not DEBUG and os.environ.get("MOX_SECURE_SSL_REDIRECT", "1") == "1"
SECURE_HSTS_SECONDS = 31536000 if not DEBUG and os.environ.get("MOX_ENABLE_HSTS", "1") == "1" else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG and os.environ.get("MOX_ENABLE_HSTS", "1") == "1"
SECURE_HSTS_PRELOAD = not DEBUG and os.environ.get("MOX_ENABLE_HSTS", "1") == "1"
SECURE_REFERRER_POLICY = os.environ.get("MOX_SECURE_REFERRER_POLICY", "strict-origin-when-cross-origin")
SECURE_CROSS_ORIGIN_OPENER_POLICY = os.environ.get("MOX_SECURE_CROSS_ORIGIN_OPENER_POLICY", "same-origin")

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.environ.get("MOX_EMAIL_HOST", "smtp.resend.com")
EMAIL_PORT = int(os.environ.get("MOX_EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.environ.get("MOX_EMAIL_USE_TLS", "1") == "1"
EMAIL_HOST_USER = os.environ.get("MOX_EMAIL_HOST_USER", "resend")
EMAIL_HOST_PASSWORD = os.environ.get("MOX_EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.environ.get("MOX_DEFAULT_FROM_EMAIL", "MoX <mox@polytechnique.fr>")
MOX_CONTACT_REPLY_TO = os.environ.get("MOX_CONTACT_REPLY_TO", "mox@polytechnique.fr")
MOX_MAX_UPLOAD_SIZE_BYTES = int(os.environ.get("MOX_MAX_UPLOAD_SIZE_BYTES", str(5 * 1024 * 1024)))
MOX_ADMIN_IP_ALLOWLIST = [
    ip.strip()
    for ip in os.environ.get("MOX_ADMIN_IP_ALLOWLIST", "").split(",")
    if ip.strip()
]
MOX_ADMIN_SESSION_TIMEOUT_SECONDS = int(
    os.environ.get("MOX_ADMIN_SESSION_TIMEOUT_SECONDS", "1800")
)
MOX_FRONTEND_SITE_URL = os.environ.get("MOX_FRONTEND_SITE_URL", "http://localhost:5173")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(asctime)s %(levelname)s %(name)s %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django.security": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "apps.content": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "apps.users": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}
