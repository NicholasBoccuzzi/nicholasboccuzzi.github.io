window.onload = function() {
 var myInput = document.getElementById('myInput');
 myInput.onpaste = function(e) {
   e.preventDefault();
 };
};
