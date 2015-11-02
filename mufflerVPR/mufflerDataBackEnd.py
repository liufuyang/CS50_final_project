import pandas as pd
#import numpy as np
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
import matplotlib.pylab as plb

class MufflerVPRDataBackEnd(object):

    def __init__(self, file_name):
        self.file_name = file_name
        self.loadData()

    def loadData(self):
        xlsx = pd.ExcelFile(self.file_name)
        # xlsx.sheet_names
        self.df1 = xlsx.parse('Sheet1')

    def getDFData(self):
        return self.df1

    def getDFDictData(self):
        return self.df1.to_dict(orient='records')

    def getLength(self):
        return self.df1.shape[0]

    def addDFDataRow(self, label, length, width, height, power):
        volume = int(length)/100*int(height)/100*int(height)/100
        VPR = volume*30/float(power)

        self.df1.loc[len(self.df1)] = {'label': label, 'length': int(length),
                                       'width': int(width), 'height': int(height),
                                       'power': int(power),
                                       'volume': volume,
                                       'VPR': VPR}

class MufflerVPRPlotLoader(object):
    def __init__(self):
        plt.style.use('ggplot')
        plt.style.use('dark_background')

    def generateVPRPlot(self, data, image):
        plt.clf()

        sc1 = plt.scatter(data['power'], data['VPR'],
                          c=data['VPR'],
                          vmin=min(data['VPR']), vmax=max(data['VPR']),
                          s=300, marker="o", alpha=0.8,
                          cmap=plt.get_cmap('Spectral'))  # RdYlBu #Spectral

        plt.legend((r'$VPR = 30\frac{V [L]}{P [kW]}$', ), loc='upper right')

        plt.plot([-100, 1000], [10, 10])

        lable_color = '#CCCCCC'

        for label, x, y in zip(data['label'], data['power'], data['VPR']):
            plt.annotate(
                label, xy=(x, y), xytext = (20, 20), color=lable_color,
                textcoords= 'offset points', ha='right', va='bottom',
                arrowprops= dict(arrowstyle='-', connectionstyle='arc3,rad=0', color=lable_color))

        plt.colorbar(sc1)
        plt.clim(3, 35)

        plb.xlim([-50, 450])
        plb.ylim([0, 35])
        plb.xlabel('Engine Power')
        plb.ylabel('VPR')
        plb.title('Volume to Power Ratio (VPR) Plot')

        fig = plt.gcf()
        fig.set_size_inches(12, 8.5)

        plt.savefig(image, format='png')
