import os
import os.path
import cherrypy

from mufflerVPR.muffler import MufflerVPR
from mufflerVPR.muffler import MufflerVPRWebService

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
            'tools.staticdir.dir': './muffler/public'
        },

        "/favicon.ico": {
            "tools.staticfile.on": True,
            "tools.staticfile.filename": os.path.join(os.path.abspath(os.getcwd()),
                                                      "./lifeinweek/public/time.ico")
        }
    }

    conf_lifeinweek = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './lifeinweek/public'
        },
        "/favicon.ico": {
            "tools.staticfile.on": True,
            "tools.staticfile.filename": os.path.join(os.path.abspath(os.getcwd()),
                                                      "./lifeinweek/public/time.ico")
        }
    }

    cherrypy.config.update({'server.socket_port': 80,
                            'server.socket_host': '0.0.0.0',
                            'engine.autoreload.on': True,
                            'log.access_file': './access.log',
                            'log.error_file': './error.log'})

    webapp_LifeInWeek = LifeInWeek()

    mufflerDataService = MufflerVPRWebService('data.xls')
    webapp_muffler = MufflerVPR(mufflerDataService)
    webapp_muffler.mufflerVPRDataProvider = mufflerDataService

    #cherrypy.quickstart(webapp, '/', conf)
    cherrypy.tree.mount(webapp_LifeInWeek, '/', conf_lifeinweek)
    cherrypy.tree.mount(webapp_muffler, '/muffler', conf_muffler)

    cherrypy.engine.start()
    cherrypy.engine.block()
