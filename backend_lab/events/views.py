from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views import View
from rest_framework import generics


from events.models import User, Event, EventInvite
from events.serializers import UserSerializer, EventSerializer, EventInviteSerializer


class UserListCreate(generics.ListCreateAPIView):
    queryset=User.objects.all()
    serializer_class = UserSerializer


class UserId(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class EventListCreate(generics.ListCreateAPIView):
    queryset=Event.objects.all()
    serializer_class = EventSerializer


class EventId(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class EventInviteListCreate(generics.ListCreateAPIView):
    queryset=EventInvite.objects.all()
    serializer_class = EventInviteSerializer

class EventInvitesByInvitee(generics.ListAPIView):
    serializer_class = EventInviteSerializer

    def get_queryset(self):
        invitee_id = self.kwargs['invitee']
        return EventInvite.objects.filter(invitee__id=invitee_id)


class EventInvitesForEvent(generics.ListAPIView):
    serializer_class = EventInviteSerializer

    def get_queryset(self):
        event_id = self.kwargs['event']
        return EventInvite.objects.filter(event__id=event_id)

