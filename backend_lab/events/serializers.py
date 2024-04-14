from rest_framework import serializers
from events.models import User, Event, EventInvite


class UserSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password=serializers.CharField()
    def create(self, validated_data):
        return User.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.password = validated_data.get("password", instance.password)
        instance.save()
        return instance

class EventSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    startDate = serializers.DateTimeField()
    endDate = serializers.DateTimeField()
    location = serializers.CharField(max_length=255)

    def create(self, validated_data):
        return Event.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.startDate = validated_data.get("startDate", instance.startDate)
        instance.endDate = validated_data.get("endDate", instance.endDate)
        instance.location = validated_data.get("location", instance.location)
        instance.save()
        return instance

class EventInviteSerializer(serializers.ModelSerializer):

    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())
    invitee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = EventInvite
        fields = '__all__'
