

// tutorial1.js
var CommentBox = React.createClass({

    loadCommentsFromServer: function() {
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

    handleCommentSubmit: function(comment) {
        // draw data on page before submit
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        // TODO: submit to the server and refresh the list
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          type: 'POST',
          data: comment,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
      this.loadCommentsFromServer();
      setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  render: function() {
    return (
        <div className="commentBox">
            <PlotPanel data={this.state.data} />
            <CommentList data={this.state.data} />
            <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        </div>
    );
  }
});

var PlotPanel = React.createClass({

    render: function() {
        var data = this.props.data.map(function (comment) {
            return (comment.label);
        });

        return(
            <div className="panel panel-default">
                <div className="panel-heading">Muffler Volume Power Ratio Plot</div>
                <div className="panel-body">
                    <p className="text-center">
                    <img src="image.png" width="960" height="720" border="0" />
                    </p>
                </div>

            </div>
        );
    }
});

// tutorial2.js
var CommentList = React.createClass({
  render: function() {
      var commentNodes = this.props.data.map(function (comment) {
            return (
              <Comment key={comment.label}
                       label={comment.label}
                       length={comment.length}
                       width={comment.width}
                       height={comment.height}
                       volume={comment.volume}
                       power={comment.power}
                       VPR={comment.VPR}
                       >
                //{comment.text}
              </Comment>
            );
      });
    return (
      //<div className="commentList">
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
        {commentNodes}
        </tbody>

        </table>
        </div>
      //</div>
    );
  }
});


var Comment = React.createClass({

  render: function() {
    return (
        <tr>
            <th>{this.props.label}</th>
            <td>{this.props.length}</td>
            <td>{this.props.width}</td>
            <td>{this.props.height}</td>
            <td>{this.props.volume.toFixed(0)}</td>
            <td>{this.props.power}</td>
            <td>{this.props.VPR.toFixed(2)}</td>
        </tr>

      //<div  className="comment">
        //<h2 className="commentAuthor">
         // {this.props.author}
        //</h2>
        //{this.props.children}
      //</div>
    );
  }
});


var CommentForm = React.createClass({
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
    this.props.onCommentSubmit({label: label, length: length,
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

      <form className="commentForm" onSubmit={this.handleSubmit}>

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
  <CommentBox url="/muffler/mufflerVPRDataProvider" pollInterval={20000}  />,
  document.getElementById('content')
);
