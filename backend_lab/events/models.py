from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, null=False)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)


    def __str__(self):
        return f"{self.username}"


class Event(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, null=False)
    description = models.TextField()
    startDate = models.DateTimeField(null=False)
    endDate = models.DateTimeField(null=True)
    location = models.CharField(max_length=255)
    attendees = models.ManyToManyField('User', through='EventInvite')

    def __str__(self):
        return f"{self.title} ({self.startDate} to {self.endDate})"


class EventInvite(models.Model):
    id = models.AutoField(primary_key=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    invitee = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Event Invite for {self.invitee.username} to {self.event.title}"