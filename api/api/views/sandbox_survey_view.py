
from rest_framework import permissions, generics

class SandboxSurveyView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, name=None):
        "hello"
        
    def put(self, request, pk, name=None):
        "hello"
    
