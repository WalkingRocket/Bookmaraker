const siteNameInput = document.getElementById("siteName");
const siteURLInput = document.getElementById("siteURL");
var sites = [];

if (localStorage.getItem("sites") != null) {
  sites = JSON.parse(localStorage.getItem("sites"));
  displaySites();
}

// I added event listeners to the inputs to validate them in real-time, but with the help of chatgt to be completely hoenst
siteNameInput.addEventListener("input", () => {
  const currentSiteName = siteNameInput.value;
  const currentSiteURL = siteURLInput.value;

  if (currentSiteName === "") {
    siteNameInput.style.borderColor = "black";
  } else if (
    currentSiteName.length < 3 ||
    currentSiteURL.startsWith(" ") ||
    currentSiteURL.endsWith(" ") ||
    DuplicateCheck(currentSiteName, currentSiteURL, true)
  ) {
    siteNameInput.style.borderColor = "red";
  } else {
    siteNameInput.style.borderColor = "green";
  }
});

siteURLInput.addEventListener("input", () => {
  if (siteURLInput.value === "") {
    siteURLInput.style.borderColor = "black";
  } else if (!isValidURL(siteURLInput.value)) {
    siteURLInput.style.borderColor = "red";
  } else {
    siteURLInput.style.borderColor = "green";
  }
});

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

  if (DuplicateCheck(SiteName, SiteURL)) return;
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

function DuplicateCheck(SiteName, SiteURL) {
  for (var i = 0; i < sites.length; i++) {
    if (sites[i].name === SiteName || sites[i].url === SiteURL) {
      alert("This site already exists in your bookmarks.");
      return true;
    }
  }
  return false;
}

function isValidURL(siteURL) {
  siteURL = siteURL.trim();

  if (!siteURL.startsWith("http://") && !siteURL.startsWith("https://")) {
    siteURL = "https://" + siteURL;
  }

  // I stole this regex pattern to be honest with the return
  const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
  return urlPattern.test(siteURL) && !siteURL.includes(" ");
}


function search() {
  var searchTerm = document.getElementById("searchInput").value;
  var negativeSearch = undefined;

  if (searchTerm.includes("-")) {
    var parts = searchTerm.split("-");
    searchTerm = parts[0].trim();
    negativeSearch = parts[1].trim();
  }

  var trs = ``;
  for (var i = 0; i < sites.length; i++) {
    var siteName = sites[i].name.toLowerCase();
    var includeMatch = siteName.includes(searchTerm.toLowerCase());
    var excludeMatch = false;
    if (negativeSearch !== undefined && negativeSearch !== "") {
      excludeMatch = siteName.includes(negativeSearch.toLowerCase());
    }

    if (includeMatch && !excludeMatch) {
      trs += `
        <tr>
          <td>${i + 1}</td>
          <td>${sites[i].name}</td>
          <td><a href="${sites[i].url}" class="btn btn-success">Visit</a></td>
          <td><button class="btn btn-danger" onclick="deleteSite(${i})">Delete</button></td>
        </tr>`;
    }
  }

  document.getElementById("bookmarksTable").innerHTML = trs;
}
