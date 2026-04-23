from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0004_auditlog"),
    ]

    operations = [
        migrations.AddField(
            model_name="leadershipmember",
            name="image_focus_x",
            field=models.PositiveSmallIntegerField(default=50),
        ),
        migrations.AddField(
            model_name="leadershipmember",
            name="image_focus_y",
            field=models.PositiveSmallIntegerField(default=18),
        ),
        migrations.CreateModel(
            name="FAQItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("question", models.CharField(max_length=255)),
                ("answer", models.TextField()),
                ("display_order", models.PositiveIntegerField(default=0)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("published", "Published")], default="draft", max_length=20)),
            ],
            options={"ordering": ["display_order", "question"]},
        ),
    ]
