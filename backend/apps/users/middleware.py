from __future__ import annotations

import ipaddress

from django.conf import settings
from django.http import HttpResponseForbidden
from django.utils import timezone


class AdminIPAllowlistMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        allowlist = getattr(settings, "MOX_ADMIN_IP_ALLOWLIST", [])
        if request.path.startswith("/admin/") and allowlist:
            client_ip = self._get_client_ip(request)
            if not self._is_allowed(client_ip, allowlist):
                return HttpResponseForbidden("Admin access is not allowed from this IP address.")
        return self.get_response(request)

    def _get_client_ip(self, request):
        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR", "")

    def _is_allowed(self, client_ip, allowlist):
        try:
            ip = ipaddress.ip_address(client_ip)
        except ValueError:
            return False

        for allowed in allowlist:
            try:
                if "/" in allowed:
                    if ip in ipaddress.ip_network(allowed, strict=False):
                        return True
                elif ip == ipaddress.ip_address(allowed):
                    return True
            except ValueError:
                continue
        return False


class AdminSessionTimeoutMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        timeout_seconds = getattr(settings, "MOX_ADMIN_SESSION_TIMEOUT_SECONDS", 0)
        if timeout_seconds and request.path.startswith("/admin/") and request.user.is_authenticated:
            request.session.set_expiry(timeout_seconds)
            request.session["mox_admin_last_seen_at"] = timezone.now().isoformat()
            request.session.modified = True
        return self.get_response(request)
