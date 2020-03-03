# Python
from datetime import datetime
import os

# Django
from django.db.models import Q

# App
from video.models import Video
from video.serializers import VideoSerializer

# Rest Framework
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    http_method_names = ['get', 'put', 'post', 'patch', 'delete']


    @action(detail=True, methods=['patch'])
    def upload_video(self, request, *args, **kwargs):
        obj = self.get_object()

        vid_file = request.data.get('file')
        metadata = request.data.get('metadata')

        if vid_file:
            obj.video.save(obj.title, vid_file, True)
            obj.is_downloaded = True

            if metadata:
                obj.metadata = metadata
            obj.save()

            try:
              obj.make_ready()
            except Exception as e:
              print(e)

        return Response(self.get_serializer().to_representation(self.get_object()))
