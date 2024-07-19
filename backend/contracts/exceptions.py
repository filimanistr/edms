from rest_framework.exceptions import APIException


class AlreadyExists(APIException):
    status_code = 409
    default_code = 'Conflict'
