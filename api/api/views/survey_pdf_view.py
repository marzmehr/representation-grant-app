import logging

from django.conf import settings
from django.http import (
    HttpResponse, HttpResponseNotFound
)
from django.http.response import HttpResponseForbidden
from django.template.loader import get_template
from django.utils import timezone

from rest_framework import permissions
from rest_framework import generics

from core.pdf import render as render_pdf
from api.models.application import Application
from api.models.prepared_pdf import PreparedPdf
from api.utils import get_application_for_user

LOGGER = logging.getLogger(__name__)


class SurveyPdfView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def generate_pdf(self, data):
        html_content = data
        pdf_content = render_pdf(html_content)
        return pdf_content

    def get_pdf(self, pk):
        try:
            pdf_id = Application.objects.values_list("prepared_pdf_id", flat=True).get(pk=pk)
            pdf_result = PreparedPdf.objects.get(id=pdf_id)
            return pdf_result
        except (PreparedPdf.DoesNotExist, Application.DoesNotExist):
            LOGGER.debug("No record found")
            return

    # Testing purposes only.
    def put(self, request, pk):
        if not request.user.is_staff and not request.user.is_superuser:
            return HttpResponseForbidden()
        data = request.data
        pdf_content = self.generate_pdf(data)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="report.pdf"'
        response.write(pdf_content)
        return response

    def post(self, request, pk, name=None):
        data = request.data
        uid = request.user.id
        app = get_application_for_user(pk, uid)
        if not app:
            return HttpResponseNotFound("No record found")

        name = request.query_params.get("name")
        try:
            pdf_result = self.get_pdf(pk)
            if not pdf_result:
                pdf_content = self.generate_pdf(data)
                (pdf_key_id, pdf_content_enc) = settings.ENCRYPTOR.encrypt(pdf_content)
                pdf_response = PreparedPdf(data=pdf_content_enc, key_id=pdf_key_id)
                pdf_response.save()
                app.prepared_pdf_id = pdf_response.pk
            else:
                pdf_queryset = PreparedPdf.objects.filter(id=pdf_result.id)
                pdf_content = self.generate_pdf(data)
                (pdf_key_id, pdf_content_enc) = settings.ENCRYPTOR.encrypt(pdf_content)
                pdf_queryset.update(data=pdf_content_enc)
                pdf_queryset.update(created_date=timezone.now())
            app.last_printed = timezone.now()
            app.save()
        except Exception as ex:
            LOGGER.error("ERROR: Pdf generation failed %s", ex)
            raise

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="report.pdf"'

        response.write(pdf_content)

        return response
