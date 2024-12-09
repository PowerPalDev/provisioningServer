import contextvars


#this class is used to store context variables for a request
class Context:
    #requestId is the id of the request, it is used to identify the request in the logs, this is an auto incremented integer
    #to avoid duplicating in logs, we will write on disk, in the future we might use a database or redis
    requestId = contextvars.ContextVar('requestId')
    #as we are an http server, we will most probably always have a remote IP
    userIp = contextvars.ContextVar('userIp')
    #we will also most probably always have a user id, the only resource usable without authentication is the login
    userId = contextvars.ContextVar('userId')

context = Context
