from django.db import migrations, models
import django.core.validators

import apps.content.models


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0005_faqitem_and_leadership_focus"),
    ]

    operations = [
        migrations.CreateModel(
            name="ClubSection",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=200)),
                ("slug", models.SlugField(blank=True, max_length=220)),
                ("kind", models.CharField(choices=[("content", "Content"), ("gallery", "Gallery")], default="content", max_length=20)),
                ("content", models.TextField(blank=True)),
                ("display_order", models.PositiveIntegerField(default=0)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("published", "Published")], default="draft", max_length=20)),
                ("club", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="sections", to="content.club")),
            ],
            options={
                "ordering": ["display_order", "title"],
                "unique_together": {("club", "slug")},
            },
        ),
        migrations.CreateModel(
            name="ClubSectionImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("image", models.ImageField(upload_to="club_sections/", validators=[django.core.validators.FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png", "webp"]), apps.content.models.validate_file_size])),
                ("caption", models.CharField(blank=True, max_length=255)),
                ("display_order", models.PositiveIntegerField(default=0)),
                ("section", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="images", to="content.clubsection")),
            ],
            options={
                "ordering": ["display_order", "id"],
            },
        ),
    ]
