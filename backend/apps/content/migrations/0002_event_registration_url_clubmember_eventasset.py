from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="registration_url",
            field=models.URLField(blank=True),
        ),
        migrations.CreateModel(
            name="ClubMember",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=200)),
                ("role", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True)),
                ("image", models.ImageField(blank=True, null=True, upload_to="club_members/")),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("phone", models.CharField(blank=True, max_length=50)),
                ("display_order", models.PositiveIntegerField(default=0)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("published", "Published")], default="draft", max_length=20)),
                ("club", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="members", to="content.club")),
            ],
            options={"ordering": ["display_order", "name"]},
        ),
        migrations.CreateModel(
            name="EventAsset",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=200)),
                ("kind", models.CharField(choices=[("image", "Image"), ("file", "File / Flyer")], default="image", max_length=20)),
                ("file", models.FileField(upload_to="events/assets/")),
                ("display_order", models.PositiveIntegerField(default=0)),
                ("event", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="assets", to="content.event")),
            ],
            options={"ordering": ["display_order", "title"]},
        ),
    ]
