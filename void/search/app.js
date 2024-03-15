const API_URL = "https://xq-api.voidlinux.org";

const searchContainer = document.querySelector("#search-container");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");

const humanFileSize = (size) => {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

const createResult = (package) => {
  const newElement = document.createElement("div");
  newElement.innerHTML = `
    <span>
      <a href="../package/?name=${package.name}">${package.name} (${package.repository})</a>
      <i>${package.version}_${package.revision} (${humanFileSize(package.filename_size)})</i>
    </span>
    <p>${package.short_desc}</p>
  `;
  searchResults.appendChild(newElement);
}

const search = async (query) => {
  const resp = await fetch(`${API_URL}/v1/query/x86_64?q=${query}`);
  const json = await resp.json();
  searchResults.innerHTML = "";
  for (let package of json["data"]) {
    createResult(package);
  }
}

const onSearch = () => {
  search(searchInput.value);
}

const onKeyPress = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    onSearch();
  }
}
