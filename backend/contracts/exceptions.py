from rest_framework.exceptions import APIException
from rest_framework import status


class AlreadyExistsException(APIException):
    status_code = 409
    default_code = 'Conflict'


class ForbiddenToEditException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
