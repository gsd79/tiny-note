
  var toolbarOptions = [
    ['bold', 'italic'],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'color': [] }, { 'background': [] }]
  ]
  var quill = new Quill('#editor', {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow'
  });
  function logHtmlContent() {
    console.log(quill.root.innerHTML);
  }