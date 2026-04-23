from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Club",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=200)),
                ("slug", models.SlugField(blank=True, max_length=220, unique=True)),
                ("tagline", models.CharField(blank=True, max_length=255)),
                ("description", models.TextField()),
                ("image", models.ImageField(blank=True, null=True, upload_to="clubs/")),
                ("contact_email", models.EmailField(blank=True, max_length=254)),
                ("contact_phone", models.CharField(blank=True, max_length=50)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("published", "Published")], default="draft", max_length=20)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="ContactMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=200)),
                ("email", models.EmailField(max_length=254)),
                ("subject", models.CharField(max_length=255)),
                ("message", models.TextField()),
                ("status", models.CharField(choices=[("unread", "Unread"), ("read", "Read"), ("replied", "Replied")], default="unread", max_length=20)),
                ("admin_reply", models.TextField(blank=True)),
                ("replied_at", models.DateTimeField(blank=True, null=True)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="LeadershipMember",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=200)),
                ("slug", models.SlugField(blank=True, max_length=220, unique=True)),
                ("role", models.CharField(max_length=200)),
                ("description", models.TextField()),
                ("image", models.ImageField(blank=True, null=True, upload_to="leadership/")),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("phone", models.CharField(blank=True, max_length=50)),
                ("display_order", models.PositiveIntegerField(default=0)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("published", "Published")], default="draft", max_length=20)),
            ],
            options={"ordering": ["display_order", "name"]},
        ),
        migrations.CreateModel(
            name="Event",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=255)),
                ("slug", models.SlugField(blank=True, max_length=280, unique=True)),
                ("description", models.TextField()),
                ("location", models.CharField(max_length=255)),
                ("start_at", models.DateTimeField()),
                ("end_at", models.DateTimeField(blank=True, null=True)),
                ("image", models.ImageField(blank=True, null=True, upload_to="events/")),
                ("tags", models.JSONField(blank=True, default=list)),
                ("is_featured", models.BooleanField(default=False)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("published", "Published")], default="draft", max_length=20)),
                ("club", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="events", to="content.club")),
            ],
            options={"ordering": ["start_at"]},
        ),
    ]
