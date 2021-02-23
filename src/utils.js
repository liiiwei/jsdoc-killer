
function strToDom(strDom) {
  const div = document.createElement('div');
  div.innerHTML = strDom;
  return div.children[0];
}
