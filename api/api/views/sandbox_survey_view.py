from django.utils import timezone
from rest_framework import permissions, generics
from rest_framework.response import Response
from api.models.sandbox_survey import SandboxSurvey
from django.http import HttpResponseBadRequest
import json


class SandboxSurveyView(generics.GenericAPIView):
    # permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        name = request.GET["sandbox_name"]
        sandbox = SandboxSurvey.objects.get(sandbox_name=name)
        data = {
            "id": sandbox.id,
            "create_timestamp": sandbox.create_timestamp,
            "update_timestamp": sandbox.update_timestamp,
            "sandbox_name": sandbox.sandbox_name,
            "sandbox_data": sandbox.sandbox_data
        }
        return Response(data)

    def put(self, request):
        body = request.data
        if not body:
            return HttpResponseBadRequest("Missing request body")

        name = body.get("sandbox_name")
        sandbox_data = body.get("sandbox_data")

        sandbox = SandboxSurvey.objects.filter(sandbox_name=name).exists()
        if not sandbox:
            db = SandboxSurvey(
                create_timestamp=timezone.now(),
                update_timestamp=timezone.now(),
                sandbox_name=name,
                sandbox_data=json.dumps(sandbox_data)
            )
            db.save()
            return Response("success")

        db = SandboxSurvey.objects.get(sandbox_name=name)

        db.update_timestamp = timezone.now()
        db.sandbox_name = name
        db.sandbox_data = sandbox_data

        db.save()

        return Response("success")
