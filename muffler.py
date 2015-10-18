
import cherrypy
import datetime

# For plotting
import matplotlib
matplotlib.use('Agg')

from matplotlib import pyplot
import numpy
from cStringIO import StringIO

class MufflerVPR(object):
    exposed = True

    @cherrypy.expose
    def index(self):
        return open('muffler/public/index.html')

    @cherrypy.expose
    def picture(self):
        return ''' <img src="image.png" width="640" height="480" border="0" /> '''

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def generate(self, **params):
        return self.data

    @cherrypy.expose
    def image_png(self):
        img = StringIO()
        self.plot(img)
        img.seek(0)
        return cherrypy.lib.static.serve_fileobj(img,
                                                 content_type="png",
                                                 name="image.png")

    def plot(self, image):
        x = numpy.linspace(0, 10)
        y = numpy.sin(x)
        pyplot.clf()
        pyplot.plot(x, y)
        pyplot.savefig(image, format='png')


class MufflerVPRWebService(object):
    exposed = True
    data = [{"author": "A guy from service", "text": "This is one comment"},
            {"author": "Jordan Walke", "text": "This is *another* comment" +
             datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}]

    #@cherrypy.tools.accept(media='text/plain')
    @cherrypy.tools.json_out()
    def GET(self, **params):
        #return cherrypy.session['mystring']
        # self.data[1]['text'] = "well..." + datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return self.data

    @cherrypy.tools.json_out()
    def POST(self, author='author1111', text='text1111'):
        #some_string = ''.join(random.sample(string.hexdigits, int(length)))
        if len(self.data) > 5:
            self.data = self.data[1:]
            #self.data.append({'author': 'Admin', 'text': 'All Data cleaned for test purpose...'})
        self.data.append({'author': author, 'text': text + '  @ ' +
                          datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                          })
        #cherrypy.session['mystring'] = some_string
        return self.data

    def PUT(self, another_string):
        cherrypy.session['mystring'] = another_string

    def DELETE(self):
        cherrypy.session.pop('mystring', None)
