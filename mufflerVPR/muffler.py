
import cherrypy
# import datetime

import pandas as pd

from cStringIO import StringIO

from mufflerDataBackEnd import MufflerVPRDataBackEnd
from mufflerDataBackEnd import MufflerVPRPlotLoader as plotLoader

class MufflerVPR(object):
    exposed = True

    def __init__(self, dataService):
        self.dataService = dataService

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
        plotLoader().generateVPRPlot(self.dataService.getData(), img)
        #self.plot(img)
        img.seek(0)
        return cherrypy.lib.static.serve_fileobj(img,
                                                 content_type="png",
                                                 name="image.png")

    # def plot(self, image):
    #     x = np.linspace(0, 10)
    #     y = np.sin(x)
    #     plt.clf()
    #     plt.plot(x, y)
    #     plt.savefig(image, format='png')


class MufflerVPRWebService(object):
    exposed = True

    def __init__(self, file_name):
        print 'Initializing MufflerVPRWebService --------------------------------------------'
        self.dataBN = MufflerVPRDataBackEnd(file_name)

    def getData(self):
        return self.dataBN.getDFData()

    # @cherrypy.tools.accept(media='text/plain')
    @cherrypy.tools.json_out()
    def GET(self, **params):
        # return cherrypy.session['mystring']
        # self.data[1]['text'] = "well..." + datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return self.dataBN.getDFDictData()  # Output dict data in json format

    @cherrypy.tools.json_out()
    def POST(self, label='label1', length='100', width='100', height='100', power='100'):
        # some_string = ''.join(random.sample(string.hexdigits, int(length)))
        if self.dataBN.getLength() < 20:
            self.dataBN.addDFDataRow(label, length, width, height, power)
        # cherrypy.session['mystring'] = some_string
        return self.dataBN.getDFDictData()  # Output dict data in json format

    def PUT(self, another_string):
        cherrypy.session['mystring'] = another_string

    def DELETE(self):
        cherrypy.session.pop('mystring', None)
