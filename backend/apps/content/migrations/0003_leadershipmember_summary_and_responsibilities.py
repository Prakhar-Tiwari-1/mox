from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0002_event_registration_url_clubmember_eventasset"),
    ]

    operations = [
        migrations.AddField(
            model_name="leadershipmember",
            name="responsibilities",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="leadershipmember",
            name="summary",
            field=models.TextField(blank=True),
        ),
    ]
