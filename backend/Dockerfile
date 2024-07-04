FROM python:3.12

WORKDIR /app/backend

COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]