from django.http.response import Http404, JsonResponse
from django.utils import timezone
from rest_framework import permissions, generics
from rest_framework.response import Response
from api.models.sandbox_survey import SandboxSurvey
from django.http import HttpResponseBadRequest
from api.serializers import SandboxSurveySerializer
from core.utils.json_message_response import JsonMessageResponse
import json


class SandboxSurveyView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)

    def get_sandbox_list(self, name):
        try:
            return SandboxSurvey.objects.get(sandbox_name=name)
        except SandboxSurvey.DoesNotExist:
            raise Http404

    def get(self, request):
        name = request.GET["sandbox_name"]
        sandbox = self.get_sandbox_list(name)
        serializer = SandboxSurveySerializer(sandbox)
        return Response(serializer.data)

    def put(self, request):
        body = request.data
        if not body:
            return JsonMessageResponse("Missing request body", status=400)

        db, _ = SandboxSurvey.objects.update_or_create(
            sandbox_name=body.get("sandbox_name"),
            defaults={
                "sandbox_data": json.dumps(body.get("sandbox_data")),
            },
        )
        db.save()
        return JsonMessageResponse("Successfully inserted data to Database", status=201)
