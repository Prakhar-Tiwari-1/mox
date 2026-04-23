from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0006_clubsection_clubsectionimage"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="max_attendees",
            field=models.PositiveIntegerField(default=100),
        ),
    ]
