# Generated by Django 3.2.4 on 2021-07-13 02:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_user_idir_userid'),
    ]

    operations = [
        migrations.CreateModel(
            name='SandboxSurvey',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_timestamp', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_timestamp', models.DateTimeField(auto_now=True, null=True)),
                ('sandbox_name', models.CharField(max_length=100, unique=True)),
                ('sandbox_data', models.TextField(blank=True)),
            ],
        ),
    ]
