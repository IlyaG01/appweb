from email.policy import default
from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from .models import ToDo

class TaskSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    is_complete = serializers.BooleanField(default=False)

    
    def create(self, validated_data):
        return ToDo.objects.create(**validated_data)
    
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.is_complete = validated_data.get("is_complete", instance.is_complete)
        instance.save()
        return instance
        
    