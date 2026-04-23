from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0007_event_max_attendees"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="recurrence_frequency",
            field=models.CharField(
                choices=[("none", "Does not repeat"), ("weekly", "Weekly")],
                default="none",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="event",
            name="recurrence_interval",
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AddField(
            model_name="event",
            name="recurrence_until",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name="EventExclusion",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("excluded_date", models.DateField()),
                ("note", models.CharField(blank=True, max_length=255)),
                ("event", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="exclusions", to="content.event")),
            ],
            options={
                "ordering": ["excluded_date"],
                "unique_together": {("event", "excluded_date")},
            },
        ),
    ]
