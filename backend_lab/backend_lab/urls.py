"""
URL configuration for backend_lab project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth.views import LoginView
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from events.views import UserListCreate, UserId, EventListCreate, EventId, EventInviteListCreate, EventInvitesByInvitee, \
    EventInvitesForEvent

schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version='v1',
        description="My API description",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('login/', LoginView.as_view(), name='login'),
    # path('api/v1/drf-auth/', include('rest_framework.urls')),
    path('api/v1/users/', UserListCreate.as_view(), name = 'UserListCreate'),
    path('api/v1/users/<int:pk>/', UserId.as_view(), name = 'UserId'),
    path('api/v1/events/', EventListCreate.as_view(), name = 'EventListCreate'),
    path('api/v1/events/<int:pk>/', EventId.as_view(), name = 'EventId'),
    path('api/v1/event-invites/', EventInviteListCreate.as_view(), name = 'EventInviteListCreate'),
    path('api/v1/event-invites/invitee/<int:invitee>/', EventInvitesByInvitee.as_view(), name = 'EventInvitesByInvitee'),
    path('api/v1/event-invites/event/<int:event>/', EventInvitesForEvent.as_view(), name = 'EventInvitesForEvent'),


    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
