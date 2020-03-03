# Python
from pathlib import Path

# Django
from django.contrib.auth.models import User
from django.conf import settings

# App
from video import models

# Rest framework
from rest_framework import serializers


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Video
        fields = "__all__"

    def create(self, validated_data):
        obj = super(VideoSerializer, self).create(validated_data)
        if validated_data.get('local_path'):
          obj.title = Path(validated_data.get('local_path')).name
          obj.save()
        return obj
