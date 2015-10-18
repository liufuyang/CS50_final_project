import os
import os.path
import cherrypy

from muffler import MufflerVPR
from muffler import MufflerVPRWebService

class LifeInWeek(object):
    @cherrypy.expose
    def index(self):
        return open('lifeinweek/public/index.html')


if __name__ == '__main__':
    conf_muffler = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },

        '/mufflerVPRDataProvider': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            # 'tools.response_headers.headers': [('Content-Type', 'text/plain')],
            'tools.response_headers.headers': [('Content-Type', 'application/json')],
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': 'muffler./public'
        }
    }

    conf_lifeinweek = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': 'lifeinweek./public'
        }
    }

    cherrypy.config.update({'server.socket_port': 80})
    webapp_LifeInWeek = LifeInWeek()
    webapp_muffler = MufflerVPR()
    webapp_muffler.mufflerVPRDataProvider = MufflerVPRWebService()

    #cherrypy.quickstart(webapp, '/', conf)
    cherrypy.tree.mount(webapp_LifeInWeek, '/', conf_lifeinweek)
    cherrypy.tree.mount(webapp_muffler, '/muffler', conf_muffler)

    cherrypy.engine.start()
    cherrypy.engine.block()
