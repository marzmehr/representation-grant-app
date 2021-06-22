
from django.db import models
class SandboxSurvey(models.Model):
    created = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated = models.DateTimeField(auto_now=True, blank=True, null=True)

    name = models.CharField(max_length=100)
    data = models.JSONField(blank=True)
