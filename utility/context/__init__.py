import contextvars

#this class is used to store context variables for a request
class Context:
    #as we are an http server, we will most probably always have a remote IP
    userIp = contextvars.ContextVar('userIp')
    #we will also most probably always have a user id, the only resource usable without authentication is the login
    userId = contextvars.ContextVar('userId')

context = Context