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

    @classmethod
    def saveRequestId(cls):
        """Save the current request ID to disk"""
        try:
            with open('request.dat', 'w') as f:
                f.write(str(cls.requestId.get()))
        except Exception:
            # If we can't save, just continue with current value
            pass
        
    @classmethod
    def loadRequestId(cls) -> int:
        """Load the last request ID from disk, or return 0 if file doesn't exist"""
        try:
            with open('request.dat', 'r') as f:
                return int(f.read().strip())
        except FileNotFoundError:
            return 0
        except Exception:
            return 0

context = Context
context.requestId.set(Context.loadRequestId())
