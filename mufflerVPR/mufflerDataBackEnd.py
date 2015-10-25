import pandas as pd
#import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.pylab as plb

class MufflerVPRDataBackEnd(object):

    def __init__(self, file_name):
        xlsx = pd.ExcelFile(file_name)
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
        matplotlib.use('Agg')
        plt.style.use('ggplot')
        plt.style.use('dark_background')

    def generateVPRPlot(self, data, image):
        plt.clf()

        sc1 = plt.scatter(data['power'], data['VPR'],
                          c=data['VPR'],
                          vmin=min(data['VPR']), vmax=max(data['VPR']),
                          s=300, marker="o", alpha=0.8,
                          cmap=plt.get_cmap('Spectral'))  # RdYlBu #Spectral

        plt.legend(('Muffler VPR', ), loc='upper right')

        plt.plot([-100, 1000], [10, 10])

        lable_color = '#CCCCCC'

        for label, x, y in zip(data['label'], data['power'], data['VPR']):
            plt.annotate(
                label, xy=(x, y), xytext = (20, 20), color=lable_color,
                textcoords= 'offset points', ha='right', va='bottom',
                arrowprops= dict(arrowstyle='-', connectionstyle='arc3,rad=0', color=lable_color))

        plt.colorbar(sc1)

        plb.xlim([-100, 1000])
        plb.xlabel('Engine Power')
        plb.ylabel('Volume to Power Ratio')
        plb.title('Volume to Power Ratio Plot')

        fig = plt.gcf()
        fig.set_size_inches(14, 9.9)

        plt.savefig(image, format='png')