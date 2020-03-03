# Python
from pathlib import Path
import uuid

# Django
from django.db import models

def upload_video_path(instance, filename):
    fp = Path(filename)
    name = fp.stem
    ext = fp.suffix

    filename = "{uuid}.{ext}".format(uuid=uuid.uuid4(), ext=ext)
    return os.path.join('media', filename)

class Video(models.Model):
    title = models.CharField(
        max_length=500,
        null=True,
        blank=True
    )

    local_path = models.CharField(
        max_length=500,
        null=True,
        blank=True
    )

    video = models.FileField(
        upload_to=upload_video_path,
        null=True,
        blank=True
    )

    is_ready = models.BooleanField(
      default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return "{} - {}".format(self.pk, self.title)
