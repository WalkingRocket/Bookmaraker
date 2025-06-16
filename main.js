SiteName = document.getElementById("siteName").value;
SiteURL = document.getElementById("siteURL").value;
var sites = [];
var test = !SiteURL.startsWith("https://");
console.log(test);

if (localStorage.getItem("sites") != null) {
  sites = JSON.parse(localStorage.getItem("sites"));
  displaySites();
}

function addSites() {
  var SiteName = document.getElementById("siteName").value;
  var SiteURL = document.getElementById("siteURL").value;

  if (!SiteURL.startsWith("https://")) {
    SiteURL = "https://" + SiteURL;
  }

  var site = {
    name: SiteName,
    url: SiteURL,
  };

  if (SiteName === "" || SiteURL === "") {
    alert("Please fill in both fields.");
    return;
  }

  if (SiteName.length < 3) {
    alert("Site name must be at least 3 characters long.");
    return;
  }

  if (!isValidURL(SiteURL)) {
    alert("Please enter a valid URL.");
    return;
  }

  if (SiteURL.startsWith(" ") || SiteURL.endsWith(" ")) {
    alert("URL cannot start or end with a space.");
    return;
  }

  if (!/\.[a-z]{2,}$/i.test(SiteURL)) {
    alert("URL must include a domain like .com, .net, .org, etc.");
    return;
  }

  DuplicateCheck();
  sites.push(site);
  localStorage.setItem("sites", JSON.stringify(sites));
  displaySites();
  clearInputs();
}

function displaySites() {
  var trs = ``;
  for (var i = 0; i < sites.length; i++) {
    trs += ` 
            <tr>
                <td>${i + 1}</td>
                <td>${sites[i].name}</td>
                <td><a href="${
                  sites[i].url
                }" class="btn btn-success">Visit</a></td>
                <td><button class="btn btn-danger" onclick="deleteSite(${i})">Delete</button></td>
            </tr>`;
  }
  document.getElementById("bookmarksTable").innerHTML = trs;
  search();
}

function deleteSite(index) {
  sites.splice(index, 1);
  localStorage.setItem("sites", JSON.stringify(sites));
  displaySites();
}

function clearInputs() {
  document.getElementById("siteName").value = "";
  document.getElementById("siteURL").value = "";
}

function DuplicateCheck() {
  for (var i = 0; i < sites.length; i++) {
    if (sites[i].name === SiteName || sites[i].url === SiteURL) {
      alert("This site already exists in your bookmarks.");
      break;
    }
  }
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}

function search() {
  var searchTerm = document.getElementById("searchInput").value;
  var negativeSearch = undefined;

  if (searchTerm.includes("-")) {
    let parts = searchTerm.split("-");
    searchTerm = parts[0].trim();
    negativeSearch = parts[1].trim();
  }

  var trs = ``;
  for (var i = 0; i < sites.length; i++) {
    var name = sites[i].name.toLowerCase();
    var positiveMatch = name.includes(searchTerm.toLowerCase());
    let negativeMatch = negativeSearch
      ? name.includes(negativeSearch.toLowerCase())
      : false;

    if (positiveMatch && !negativeMatch) {
      trs += ` 
            <tr>
                <td>${i + 1}</td>
                <td>${sites[i].name}</td>
                <td><a href="${
                  sites[i].url
                }" class="btn btn-success">Visit</a></td>
                <td><button class="btn btn-danger" onclick="deleteSite(${i})">Delete</button></td>
            </tr>`;
    }
  }

  document.getElementById("bookmarksTable").innerHTML = trs;
}
