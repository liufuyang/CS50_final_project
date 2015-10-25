

// tutorial1.js
var MufflerVPRDataBox = React.createClass({

    loadMufflerVPRDatasFromServer: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    handleMufflerVPRDataSubmit: function(mufflerData) {
        // draw data on page before submit
        var mufflerDatas = this.state.data;
        var newMufflerVPRDatas = mufflerDatas.concat([mufflerData]);
        this.setState({data: newMufflerVPRDatas});

        // TODO: submit to the server and refresh the list
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          type: 'POST',
          data: mufflerData,
          success: function(data) {
            this.setState({data: data,
                            picture_id: this.state.picture_id+1});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    getInitialState: function() {
    return {data: [], picture_id:1 };
  },
  componentDidMount: function() {
      this.loadMufflerVPRDatasFromServer();
      setInterval(this.loadMufflerVPRDatasFromServer, this.props.pollInterval);
  },

  render: function() {
    return (
        <div className="mufflerDataBox">
            <PlotPanel picture_id={this.state.picture_id} />
            <MufflerVPRDataList data={this.state.data} />
            <MufflerVPRDataForm onMufflerVPRDataSubmit={this.handleMufflerVPRDataSubmit}/>
        </div>
    );
  }
});

var PlotPanel = React.createClass({

    render: function() {

        var url = "image.png?id=" + this.props.picture_id;
        return(
            <div className="panel panel-default">
                <div className="panel-heading">Muffler Volume Power Ratio Plot</div>
                <div className="panel-body">
                    <p className="text-center">
                    <img src={url}  width="960" height="720" border="0" />
                    </p>
                </div>

            </div>
        );
    }
});

// tutorial2.js
var MufflerVPRDataList = React.createClass({
  render: function() {
      var mufflerDataNodes = this.props.data.map(function (mufflerData) {
            return (
              <MufflerVPRData key={mufflerData.label}
                       label={mufflerData.label}
                       length={mufflerData.length}
                       width={mufflerData.width}
                       height={mufflerData.height}
                       volume={mufflerData.volume}
                       power={mufflerData.power}
                       VPR={mufflerData.VPR}
                       >
              </MufflerVPRData>
            );
      });
    return (
      //<div className="mufflerDataList">
      <div className="panel panel-default">

        <div className="panel-heading">Muffer VPR Plot Data</div>
        <div className="panel-body">
          <p>Here is the data that used to generate the plot above.</p>
        </div>

        <table className="table table-striped">

        <thead>
        <tr>
            <th>Muffler Label</th>
            <th>Length[mm]</th>
            <th>Width[mm]</th>
            <th>Height[mm]</th>
            <th>Volume[L]</th>
            <th>Power[kW]</th>
            <th>VPR</th>
        </tr>
        </thead>
        <tbody>
        {mufflerDataNodes}
        </tbody>

        </table>
        </div>
      //</div>
    );
  }
});


var MufflerVPRData = React.createClass({

  render: function() {
      // Formating output

    var volume = this.props.volume;
    var VPR = this.props.VPR;

    volume = volume != 'undefined' ? volume : volume.toFixed(0);
    VPR = VPR != 'undefined' ? VPR : VPR.toFixed(0);

    // Render data row
    return (
    <tr>
        <th>{this.props.label}</th>
        <td>{this.props.length}</td>
        <td>{this.props.width}</td>
        <td>{this.props.height}</td>
        <td>{volume}</td>
        <td>{this.props.power}</td>
        <td>{VPR}</td>
    </tr>
    );
  }
});


var MufflerVPRDataForm = React.createClass({
    handleSubmit: function(e) {
    e.preventDefault();
    var label = this.refs.label.value.trim();
    var length = this.refs.length.value.trim();
    var width = this.refs.width.value.trim();
    var height = this.refs.height.value.trim();
    var power = this.refs.power.value.trim();

    if (!label || !length || !width || !height || !power ) {
      return;
    }
    // TODO: send request to the server
    this.props.onMufflerVPRDataSubmit({label: label, length: length,
                                width: width, height: height, power: power});
    this.refs.label.value = '';
    this.refs.length.value = '';
    this.refs.width.value = '';
    this.refs.height.value = '';
    this.refs.power.value = '';
    return;
  },

  render: function() {
    return (
        <div className="panel panel-default">
  <div className="panel-heading">Adding Another Muffler Case</div>
  <div className="panel-body">

      <form className="mufflerDataForm" onSubmit={this.handleSubmit}>

      <div className="row">

      <div className="col-lg-3">
      <div className="input-group input-group-sm">
            <span className="input-group-addon">Label</span>
            <input type="text" className="form-control" placeholder="Product Nr." ref="label"/>
      </div>
      </div>

      <div className="col-lg-2">
      <div className="input-group input-group-sm">
            <span className="input-group-addon">Length</span>
            <input type="text" className="form-control" placeholder="in mm" ref="length"/>
      </div>
      </div>

      <div className="col-lg-2">
      <div className="input-group input-group-sm">
            <span className="input-group-addon">Width</span>
          <input type="text" className="form-control" placeholder="in mm" ref="width"/>
       </div>
       </div>

       <div className="col-lg-2">
       <div className="input-group input-group-sm">
             <span className="input-group-addon">Height</span>
           <input type="text" className="form-control" placeholder="in mm" ref="height"/>
        </div>
        </div>

        <div className="col-lg-2">
        <div className="input-group input-group-sm">
              <span className="input-group-addon">Power</span>
            <input type="text" className="form-control" placeholder="in kW" ref="power"/>
         </div>
         </div>



         <div className="col-lg-1">
         <div className="input-group input-group-sm">
         <button  type="submit" className="btn btn-success btn-sm" >
             Submit
         </button>
         </div>
         </div>
         </div>

      </form>

      </div>
     </div>

    );
  }
});



ReactDOM.render(
  <MufflerVPRDataBox url="/muffler/mufflerVPRDataProvider" pollInterval={20000}  />,
  document.getElementById('content')
);
