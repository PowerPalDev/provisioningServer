import contextvars

#this class is used to store context variables for a request
class Context:
    #requestId is the id of the request, it is used to identify the request in the logs, this is an auto incremented integer
    #to avoid duplicating in logs, we will write on disk, in the future we might use a database or redis
    requestId = contextvars.ContextVar('requestId')
    user = contextvars.ContextVar('user')

context = Context
