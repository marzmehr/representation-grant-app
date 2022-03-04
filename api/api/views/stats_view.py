from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from api.models.prepared_pdf import PreparedPdf
from api.models.application import Application


class StatsView(APIView):
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)

    def get(self, request: Request):
        forms = ["FormP1", "FormP9"]
        stats = []

        for app in Application.objects.all():
            row = {"ID": app.id}

            for form in forms:
                try:
                    px = PreparedPdf.objects.get(application_id=app.id, pdf_type=form)
                except:
                    px = False

                row.update(
                    {
                        f"{form}": "Yes" if px else "No",
                        f"{form} Created Date": px.created_date if px else None,
                    }
                )

            stats.append(row)

        stats.append(
            {
                "Total Applications": len(stats),
                "Total FormP1s": len(
                    [stat for stat in stats if stat[forms[0]] == "Yes"]
                ),
                "Total FormP9s": len(
                    [stat for stat in stats if stat[forms[1]] == "Yes"]
                ),
            }
        )

        return Response(stats)
