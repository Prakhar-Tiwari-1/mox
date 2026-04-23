from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "MoX Control Panel"
admin.site.site_title = "MoX Admin"
admin.site.index_title = "Content and Operations"
admin.site.site_url = settings.MOX_FRONTEND_SITE_URL

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.content.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
