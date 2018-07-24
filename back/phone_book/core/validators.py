import re
from rest_framework.serializers import ValidationError


def phone_validator(val):
    if not re.match("^\\+79[0-9]{9}$", val) and val:
        raise ValidationError('Wrong format')
