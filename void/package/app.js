const API_URL = "https://xq-api.voidlinux.org";

const packageInfo = document.querySelector("#package-info");

const humanFileSize = (size) => {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

const displayInfo = (title, value) => {
  const formattedValue = title == "revision" ? value :
    title == "homepage" ? `<a href="${value}">${value}</a>`:
    title == "name" ? `<a href="https://github.com/void-linux/void-packages/blob/master/srcpkgs/${value}/template">${value}</a>`:
    !isNaN(value) ? humanFileSize(value) :
    title == "rundepends" ? value.map((pkg) =>
        `<a href="?name=${pkg.split(">=")[0]}">${pkg}</a>`
      ).join(", ") :
    Array.isArray(value) ? value.join(", ") : 
    value;
  const newElement = document.createElement("div");
  newElement.innerHTML = `
    <h4>${title}:</h4>
    <span>${formattedValue}</span>
  `;
  packageInfo.appendChild(newElement);
}

const loadPackageInfo = async (pkgName) => {
  const response = await fetch(`${API_URL}/v1/packages/x86_64/${pkgName}`);
  const data = (await response.json())["data"];
  for (let key in data) {
    if (["build_date", "source_revisions"].includes(key)) continue;
    displayInfo(key.replace("_", ""), data[key]);
  }
}

const urlParams = new URLSearchParams(window.location.search);
const pkgName = urlParams.get("name");
if (pkgName) loadPackageInfo(pkgName);
