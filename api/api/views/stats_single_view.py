from email.mime import application
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from api.models.prepared_pdf import PreparedPdf
from api.models.application import Application
from api.utils import get_application_for_user


class StatsSingleView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request: Request, pk):
        forms = ["FormP1", "FormP9"]
        uid = request.user.id
        application = get_application_for_user(pk, uid)
        stats = {"ID": application.id}

        for form in forms:
            try:
                px = PreparedPdf.objects.get(application_id=application.id, pdf_type=form)
            except:
                px = False

            stats.update(
                {
                    f"{form}": "Yes" if px else "No",
                    f"{form} Created Date": px.created_date if px else None,
                    f"{form} Last Updated": px.last_updated if px and px.last_updated else None,
                }
            )

        return Response(stats)
