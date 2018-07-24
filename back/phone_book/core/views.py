from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from core.serializers import ContactSerializer
from core.models import Contact


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def contacts_list(request):
    if request.method == 'GET':
        page = request.GET.get('page')
        if page:
            page = int(page)
            contacts = request.user.contact_set.all()[5 * page: 5 * (page + 1)]
            serializer = ContactSerializer(contacts, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'POST':
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def contacts_detail(request, pk):

    try:
        contact = Contact.objects.get(pk=pk, owner=request.user)
    except Contact.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = ContactSerializer(contact, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        contact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contacts_search(request, query):

    if request.method == 'GET':
        contacts = request.user.contact_set.filter(Q(name__istartswith=query) |
                                          Q(surname__istartswith=query) |
                                          Q(email__istartswith=query) |
                                          Q(phone__istartswith=query))
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):

    if request.method == 'POST':
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
