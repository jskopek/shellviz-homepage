var sv = new window.Shellviz(document.querySelector('.shellviz-window'));

document.querySelectorAll('.example').forEach((el) => {
    el.addEventListener('click', (e) => {
        document.querySelectorAll('.example').forEach((el) => { el.classList.remove('active'); });
        el.classList.add('active');

        var mode = el.dataset['mode'];
        if(el.dataset['visualize']) {
            var data = el.dataset['visualize'];
            try {
                data = JSON.parse(data, mode);
            } catch(e) {}
            sv.data(undefined, data);
        } else if(el.dataset['visualizeJson']) {
            var jsonPath = el.dataset['visualizeJson'];
            fetch(`/static/examples/${jsonPath}`)
            .then((response) => {
                return response.json()
            })
            .then((jsonResponse) => {
                return sv.data(undefined, jsonResponse, mode);
            });
        }
    });
})

//endtesting



// ----------------------- TABS -------------------
// https://www.w3schools.com/howto/howto_js_tabs.asp
document.querySelectorAll('.tablinks').forEach((el) => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.tabcontent').forEach((e) => e.classList.remove('active'));
        document.querySelector('.tabcontent#' + el.dataset['target']).classList.add('active');
    });
});
document.querySelector('.tabcontent').classList.add('active');

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
// ---------------------- END TABS -------------------
