from django.http import HttpResponse
from django.shortcuts import redirect, render
from pkg_resources import require
from .models import ToDo
from django.views.decorators.http import require_http_methods

# Create your views here.

def index(request):
    #print(request)
    todos = ToDo.objects.all()
    #print(todos)
    return render(request, 'todoapp/index.html',{'todo_list': todos, 'title': 'Главная страница'})


@require_http_methods(['POST'])
def add(request):
    title = request.POST['title']
    todo = ToDo(title=title)
    todo.save()
    return redirect('index')

def update(request, todo_id):
    todo = ToDo.objects.get(id=todo_id)
    todo.is_complete = not todo.is_complete
    todo.save()
    return redirect('index')

def delete(request, todo_id):
    todo = ToDo.objects.get(id=todo_id)
    todo.delete()
    return redirect('index')