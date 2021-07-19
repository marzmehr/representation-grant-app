from django.db import models


class SandboxSurvey(models.Model):
    id = models.AutoField(
        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
    )
    create_timestamp = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    update_timestamp = models.DateTimeField(auto_now=True, blank=True, null=True)
    sandbox_name = models.CharField(max_length=100, unique=True)
    sandbox_data = models.TextField(blank=True)
