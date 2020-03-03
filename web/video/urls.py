# App
from video.views import VideoViewSet

# Rest Framework
from rest_framework import routers

router = routers.SimpleRouter()

router.register( r'video', VideoViewSet, basename='video')

app_name = "video"
urlpatterns = router.urls
