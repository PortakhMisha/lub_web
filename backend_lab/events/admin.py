from django.contrib import admin

from events.models import User, Event, EventInvite
class EventInviteInline(admin.TabularInline):
    model = EventInvite
    extra = 1

class EventAdmin(admin.ModelAdmin):
    inlines = [EventInviteInline]
# Register your models here.
admin.site.register(User)
admin.site.register(Event, EventAdmin)
admin.site.register(EventInvite)