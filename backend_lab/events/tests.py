
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from events.models import User, Event


# Create your tests here.
class BasicAppAPIViewUsersTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('UserListCreate')

    def test_get_users(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_post_user(self):
        data = {'username': 'Test User', 'email': 'mail@mail.com', 'password':'1234'}
        print(f"Data to post: {data}")
        response = self.client.post(self.url, data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_put_user(self):
        user = User.objects.create(username="Test User", email="mail@mail.com", password="1234")
        put_url = reverse('UserId', kwargs={'pk': user.id})
        updated_data = {'username': 'Updated User', 'email': 'updated@mail.com', 'password': '5678',}
        response = self.client.put(put_url, updated_data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_user(self):
        user = User.objects.create(username="Test User", email="mail@mail.com", password="1234")
        delete_url = reverse('UserId', kwargs={'pk': user.id})
        response = self.client.delete(delete_url)
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class BasicAppAPIViewEventsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('EventListCreate')

    def test_get_events(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_event(self):
        user = User.objects.create(username="Test User", email="mail@mail.com", password="1234")
        data = {
            'title': 'Test Event',
            'description': 'Event description',
            'startDate': timezone.now(),
            'endDate': timezone.now() + timezone.timedelta(hours=2),
            'location': 'Event Location',
            'attendees': [user.id],
        }
        print(f"Data to post: {data}")
        response = self.client.post(self.url, data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_put_event(self):
        user = User.objects.create(username="Test User", email="mail@mail.com", password="1234")
        event = Event.objects.create(
            title="Test Event",
            description="Event description",
            startDate=timezone.now(),
            endDate=timezone.now() + timezone.timedelta(hours=2),
            location="Event Location",
        )
        event.attendees.add(user)
        put_url = reverse('EventId', kwargs={'pk': event.id})
        updated_data = {
            'title': 'Updated Event',
            'description': 'Updated description',
            'startDate': timezone.now(),
            'endDate': timezone.now() + timezone.timedelta(hours=3),
            'location': 'Updated Location',
        }
        response = self.client.put(put_url, updated_data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_event(self):
        user = User.objects.create(username="Test User", email="mail@mail.com", password="1234")
        event = Event.objects.create(
            title="Test Event",
            description="Event description",
            startDate=timezone.now(),
            endDate=timezone.now() + timezone.timedelta(hours=2),
            location="Event Location",
        )
        event.attendees.add(user)
        delete_url = reverse('EventId', kwargs={'pk': event.id})
        response = self.client.delete(delete_url)
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class BasicAppAPIViewEventInvitesTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.event_url = reverse('EventListCreate')
        self.user_url = reverse('UserListCreate')
        self.invite_url = reverse('EventInviteListCreate')

    def create_event(self):
        data = {
            'title': 'Test Event',
            'description': 'Event description',
            'startDate': '2023-01-01T00:00:00Z',
            'endDate': '2023-01-01T02:00:00Z',
            'location': 'Event Location',
        }
        response = self.client.post(self.event_url, data, format='json')
        return response.data['id']

    def create_user(self):
        data = {'username': 'Test User', 'email': 'mail@mail.com', 'password': '1234'}
        response = self.client.post(self.user_url, data, format='json')
        return response.data['id']

    def test_get_events_invites(self):
        response = self.client.get(self.invite_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_event_invite(self):
        event_id = self.create_event()
        user_id = self.create_user()

        data = {'event': event_id, 'invitee': user_id}
        response = self.client.post(self.invite_url, data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_event_invites_by_invitee(self):
        user_id = self.create_user()
        response = self.client.get(reverse('EventInvitesByInvitee', kwargs={'invitee': user_id}))
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_event_invites_for_event(self):
        event_id = self.create_event()
        response = self.client.get(reverse('EventInvitesForEvent', kwargs={'event': event_id}))
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
