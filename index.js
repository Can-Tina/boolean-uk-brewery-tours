const mainArea = document.querySelector("main")
const stateFormEnter = document.getElementById("select-state")
let currentState = ""

let state = {
  selectStateInput: "",
  breweries: [],
  cities: [],
  filters: {
    type: "",
    city: [],
    search: ""
  }
};

function getBreweryType(breweryData) {
  const validType = [];
  for (let i = 0; i < breweryData.length; i++) {
    if (state.filters.type === "" && (breweryData[i].brewery_type === "micro" || breweryData[i].brewery_type === "regional" || breweryData[i].brewery_type === "brewpub")) {
      validType.push(breweryData[i]);
    } else if (breweryData[i].brewery_type == state.filters.type) {
      validType.push(breweryData[i]);
    }
  }
  createMainAside(validType)
  createMainList(validType)
  console.log(validType)
}

appendToElement = (element, parentElement) => parentElement.append(element)

function createElementWClass(element = "", className = "", innerText = "") {
    const tempEl = document.createElement(element);
    tempEl.classList.add(className);
    tempEl.innerText = String(innerText);
    return tempEl;
}

function createElementWOClass(element = "", innerText = "") {
    const tempEl = document.createElement(element);
    tempEl.innerText = String(innerText);
    return tempEl;
}

function readPubType(event){
  console.log(event.target.value)
  if (event.target.value == "micro" || event.target.value == "regional" || event.target.value == "brewpub" || event.target.value == "") {
    state.filters.type = event.target.value
    console.log(state.filters.type)
    fetchBreweryByState(currentState)
  } else [
    console.log("failure :(")
  ]
}

function createMainAside(stateData) {
  mainArea.innerHTML = ""

  const mainAside = createElementWClass("aside", "filters-section")
  appendToElement(mainAside, mainArea)

  function createFilterSection() {
    const filterBy = createElementWOClass("h2", "Filter By:")
    mainAside.append(filterBy)

    const filterByForm = createElementWOClass("form")
    filterByForm.setAttribute("id", "filter-by-type-form")
    filterByForm.setAttribute("autocomplete", "off")
    mainAside.append(filterByForm)

    const filterByFormLabel = createElementWOClass("label")
    filterByFormLabel.setAttribute("for", "filter-by-type")
    filterByForm.append(filterByFormLabel)

    const typeOfBrewery = createElementWOClass("h3", "Type of brewery")
    filterByFormLabel.append(typeOfBrewery)

    const select = createElementWOClass("select")
    select.setAttribute("name", "filter-by-type")
    select.setAttribute("id", "filter-by-type")
    filterByForm.append(select)

    const selectType = createElementWOClass("option", "Select a Type...")
    selectType.setAttribute("value", "")
    select.append(selectType)

    const micro = createElementWOClass("option", "Micro")
    micro.setAttribute("value", "micro")
    select.append(micro)

    const regional = createElementWOClass("option", "Regional")
    regional.setAttribute("value", "regional")
    select.append(regional)

    const brewpub = createElementWOClass("option", "Brewpub")
    brewpub.setAttribute("value", "brewpub")
    select.append(brewpub)

    select.addEventListener('click', (event) => readPubType(event));

    const cityHeading = createElementWClass("div", "filter-by-city-heading")
    mainAside.append(cityHeading)

    const cities = createElementWOClass("h3", "Cities")
    cityHeading.append(cities)

    const clearCityButton = createElementWClass("button", "clear-all-btn", "clear all")
    cityHeading.append(clearCityButton)

  }

  function readCityInput(event){
    console.log(event.target.value);
    let cityDupe = false;

    for (let i = 0; i < state.filters.city.length; i++) {
      if (event.target.value === state.filters.city[i]) {
        cityDupe = true  
        break
      } else {
        cityDupe = false
      }
    }

    if (cityDupe === false) {
      state.filters.city.push(event.target.value)
      console.log(state.filters.city)
    } else {
      for (let i = 0; i < state.filters.city.length; i++) {
        if (event.target.value === state.filters.city[i]) {
          state.filters.city.splice(i, 1)
          console.log(state.filters.city)
          break
        } 
      }
    }
    fetchBreweryByState(currentState)
  }

  function createCityFilter(cityData) {
    const filterByCity = createElementWOClass ("form")
    filterByCity.setAttribute("id", "filter-by-city-form")
    mainAside.append(filterByCity)

    let cityList = []
    

    for (let i = 0; i < cityData.length; i++) {
      let duplicate = false
      for (let j = 0; j < cityList.length; j++) {
        if (cityData[i].city === cityList[j]) {
          duplicate = true
          break
        } else {
          duplicate = false
        }
      }
      
      if (duplicate === false) {
        cityList.push(cityData[i].city)
        const cityInput = createElementWOClass("input")
        cityInput.setAttribute("type", "checkbox")
        cityInput.setAttribute("name", cityData[i].city.toLowerCase())
        cityInput.setAttribute("value", cityData[i].city)
        for(let j = 0; j < state.filters.city.length; j++) {
          if (cityData[i].city === state.filters.city[j]) {
            cityInput.checked = true
            break
          }
        }
        filterByCity.append(cityInput)

        cityInput.addEventListener('click', (event) => readCityInput(event));

        const cityLabel = createElementWOClass("label", cityData[i].city)
        cityLabel.setAttribute("for", cityData[i].city.toLowerCase())
        filterByCity.append(cityLabel)

      }
    }
  }

  
  
  createFilterSection()
  createCityFilter(stateData)

}

function createMainList(breweryData) {
  const title = createElementWOClass("h1", "List of Breweries")
  mainArea.append(title)

  const header = createElementWClass("header", "search-bar")
  mainArea.append(header)

  const searchForm = createElementWOClass("form")
  searchForm.setAttribute("id", "search-breweries-form")
  searchForm.setAttribute("autocomplete", "off")
  header.append(searchForm)

  const searchLabel = createElementWOClass("label")
  searchLabel.setAttribute("for", "search-breweries")
  searchForm.append(searchLabel)

  const searchH2 = createElementWOClass("h2", "Search breweries:")
  searchLabel.append(searchH2)

  const searchInput = createElementWOClass("input")
  searchInput.setAttribute("id", "search-breweries")
  searchInput.setAttribute("name", "search-breweries")
  searchInput.setAttribute("type", "text")
  searchForm.append(searchInput)

  const listArticle = createElementWOClass("article")
  mainArea.append(listArticle)

  const listUl = createElementWClass("ul", "breweries-list")
  listArticle.append(listUl)

  function createBreweries(data) {
    console.log(state.filters.type)
    console.log(state.filters.city.length)
    if (state.filters.city.length < 1) {
      for (let i = 0; i < 10; i++) {
      const breweryLi = createElementWOClass("li")
      listUl.append(breweryLi)
  
      const breweryH2 = createElementWOClass("h2", data[i].name)
      breweryLi.append(breweryH2)

      const typeDiv = createElementWClass("div", "type", data[i].brewery_type)
      breweryLi.append(typeDiv)

      const addressSection = createElementWClass("section", "address")
      breweryLi.append(addressSection)

      const addressH3 = createElementWOClass("h3", "Address:")
      addressSection.append(addressH3)

      const addressStreet = createElementWOClass("p", data[i].street)
      addressSection.append(addressStreet)

      const addressOther = createElementWOClass("p")
      addressSection.append(addressOther)

      const addressStrong = createElementWOClass("strong")
      addressStrong.innerText = (data[i].city + ", " + data[i].postal_code)
      addressOther.append(addressStrong)

      const phoneSection = createElementWClass("section", "phone")
      breweryLi.append(phoneSection)

      const phoneH3 = createElementWOClass("h3", "Phone:")
      phoneSection.append(phoneH3)

      const phoneNumber = createElementWOClass("p", data[i].phone)
      phoneSection.append(phoneNumber)

      const linkSection = createElementWClass("section", "link")
      breweryLi.append(linkSection)

      const link = createElementWOClass("a", "Visit Website")
      link.setAttribute("href", data[i].website_url)
      link.setAttribute("target", "_blank")
      linkSection.append(link)

      console.log(data[i])
      console.log(i + 1)
      } 
    } else {
      console.log("else")
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < state.filters.city.length; j++) {
          if (data[i].city === state.filters.city[j]) {
            const breweryLi = createElementWOClass("li")
            listUl.append(breweryLi)
        
            const breweryH2 = createElementWOClass("h2", data[i].name)
            breweryLi.append(breweryH2)
      
            const typeDiv = createElementWClass("div", "type", data[i].brewery_type)
            breweryLi.append(typeDiv)
      
            const addressSection = createElementWClass("section", "address")
            breweryLi.append(addressSection)
      
            const addressH3 = createElementWOClass("h3", "Address:")
            addressSection.append(addressH3)
      
            const addressStreet = createElementWOClass("p", data[i].street)
            addressSection.append(addressStreet)
      
            const addressOther = createElementWOClass("p")
            addressSection.append(addressOther)
      
            const addressStrong = createElementWOClass("strong")
            addressStrong.innerText = (data[i].city + ", " + data[i].postal_code)
            addressOther.append(addressStrong)
      
            const phoneSection = createElementWClass("section", "phone")
            breweryLi.append(phoneSection)
      
            const phoneH3 = createElementWOClass("h3", "Phone:")
            phoneSection.append(phoneH3)
      
            const phoneNumber = createElementWOClass("p", data[i].phone)
            phoneSection.append(phoneNumber)
      
            const linkSection = createElementWClass("section", "link")
            breweryLi.append(linkSection)
      
            const link = createElementWOClass("a", "Visit Website")
            link.setAttribute("href", data[i].website_url)
            link.setAttribute("target", "_blank")
            linkSection.append(link)
      
            console.log(data[i])
            console.log(i + 1)
            break
          }
        }
      }
    }
  }
  createBreweries(breweryData)
}

function fetchBreweryByState(state) {
  fetch(
  `https://api.openbrewerydb.org/breweries?by_state=` + state
)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log(data);
    getBreweryType(data)
  });
}

function readStateForm() {
  currentState = stateFormEnter.value
  console.log(currentState)
  fetchBreweryByState(currentState)
}

stateFormEnter.onkeydown = function(e) {
  if(e.keyCode == 13){
    e.preventDefault()
    state.filters.city = []
    readStateForm()
  }
}
