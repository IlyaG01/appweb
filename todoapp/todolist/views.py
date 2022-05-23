from django.http import HttpResponse
from django.shortcuts import redirect, render
from pkg_resources import require
from .models import ToDo
from django.views.decorators.http import require_http_methods
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import TaskSerializer
# Create your views here.

def index(request):
    todos = ToDo.objects.all()
    return render(request, 'todoapp/index.html',{'todo_list': todos, 'title': 'Главная страница'})

class TodoAPIView(APIView):
    def get(self, request):
        tasks = ToDo.objects.all()
        return Response({
            tasks.values() 
        })  
    def put(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({
                "error": "Method PUT not accessed"
            })
        try:
            instance = ToDo.objects.get(pk = pk)
        except:
            return Response({
                "error": "Object not found"
            })
        serializer = TaskSerializer(data=request.data,instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'post': serializer.data,
            })
    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'post': 'ОК',
            })
    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({
                "error": "DELETE not accessed"
            })
        
        try:
            instance = ToDo.objects.get(pk = pk)
            instance.delete()
        except:
            return Response({
                "error": "Object not found"
            })
            
        return Response({
            'post': f"delete task {pk}"
        })