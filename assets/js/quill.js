var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],     
    [{ 'size': ['small', false, 'large', 'huge'] }] ,// custom dropdown          // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],


    [{ 'size': ['small', false, 'large', 'huge'] }] // custom dropdown


    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];
var quill = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions
    },
    placeholder: 'What is on your mind?...',
    theme: 'snow'
});
function logHtmlContent() {
    console.log(quill.root.innerHTML);
}

