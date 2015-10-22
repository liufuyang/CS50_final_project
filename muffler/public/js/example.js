

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
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

// tutorial2.js
var CommentList = React.createClass({
  render: function() {
      var commentNodes = this.props.data.map(function (comment) {
            return (
              <Comment key={comment.author} author={comment.author} text={comment.text}>
                //{comment.text}
              </Comment>
            );
      });
    return (
      //<div className="commentList">
      <div className="panel panel-default">

        <div className="panel-heading">Plot Data</div>
        <div className="panel-body">
          <p>Here is the data that used to generate the plot above.</p>
        </div>

        <table className="table">

        <thead>
        <tr>
            <th>Muffler Label</th>
            <th>Length</th>
            <th>Width</th>
            <th>Height</th>
            <th>Volume</th>
            <th>Power</th>
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
            <th>{this.props.author}</th>
            <td>{this.props.text}</td>
            <td>Width</td>
            <td>Height</td>
            <td>Volume</td>
            <td>Power</td>
            <td>VPR</td>
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
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if (!text || !author) {
      return;
    }
    // TODO: send request to the server
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
    return;
  },

  render: function() {
    return (
        <div className="panel panel-default">
  <div className="panel-heading">Adding another muffler case</div>
  <div className="panel-body">

      <form className="commentForm" onSubmit={this.handleSubmit}>

      <div className="row">

      <div className="col-lg-2">
      <div className="input-group input-group-sm">
            <span className="input-group-addon">Label</span>
            <input type="text" className="form-control" placeholder="" ref="author"/>
      </div>
      </div>

      <div className="col-lg-2">
      <div className="input-group input-group-sm">
            <span className="input-group-addon">Length</span>
            <input type="text" className="form-control" placeholder="in mm" ref="text"/>
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



         <div className="col-lg-2">
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
  <CommentBox url="/muffler/mufflerVPRDataProvider" pollInterval={2000}  />,
  document.getElementById('content')
);
