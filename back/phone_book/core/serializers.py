from rest_framework import serializers
from core.models import Contact
from core.validators import phone_validator


class ContactSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(validators=[phone_validator], allow_blank=True)

    class Meta:
        model = Contact
        fields = ('id', 'name', 'surname', 'phone', 'email')
