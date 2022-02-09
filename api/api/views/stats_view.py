from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from api.models.prepared_pdf import PreparedPdf
from api.models.application import Application


class StatsView(APIView):
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)

    def get(self, request: Request):
        stats = []

        for app in Application.objects.all():
            row = {
                "ID": app.id
            }

            try:
                p1 = PreparedPdf.objects.get(application_id=app.id, pdf_type="FormP1")
            except:
                p1 = False

            try:
                p9 = PreparedPdf.objects.get(application_id=app.id, pdf_type="FormP9")
            except:
                p9 = False

            if p1:
                row.update({
                    "Form P1": "Yes",
                    "P1 Created Date": p1.created_date,
                })
            else:
                row.update({
                    "Form P1": "No",
                    "P1 Created Date": None,
                })

            if p9:
                row.update({
                    "Form P9": "Yes",
                    "P9 Created Date": p9.created_date,
                })
            else:
                row.update({
                    "Form P9": "No",
                    "P9 Created Date": None,
                })
            
            stats.append(row)

        stats.append({
            "Total Applications": len(stats),
            "Total P1s": len([True for stat in stats if stat["Form P1"] == "Yes"]),
            "Total P9s": len([True for stat in stats if stat["Form P9"] == "Yes"])
        })

        return Response(stats)
