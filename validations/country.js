const countries = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" }
];

function autocomplete(inp, arr) {
  let currentFocus;

  inp.addEventListener("input", function() {
    const val = this.value;
    closeAllLists();
    if (!val) return false;
    currentFocus = -1;

    const listContainer = document.createElement("DIV");
    listContainer.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(listContainer);

    arr.forEach(item => {
      if (
        item.code.toLowerCase().includes(val.toLowerCase()) ||
        item.name.toLowerCase().includes(val.toLowerCase())
      ) {
        const itemDiv = document.createElement("DIV");
        itemDiv.setAttribute("class", "autocomplete-item");

        // Highlight matching text (optional)
        const codeIndex = item.code.toLowerCase().indexOf(val.toLowerCase());
        const nameIndex = item.name.toLowerCase().indexOf(val.toLowerCase());

        let displayText = "";
        if (codeIndex !== -1) {
          displayText = item.code.substring(0, codeIndex) +
                        "<strong>" + item.code.substring(codeIndex, codeIndex + val.length) + "</strong>" +
                        item.code.substring(codeIndex + val.length) + " - " + item.name;
        } else if (nameIndex !== -1) {
          displayText = item.code + " - " +
                        item.name.substring(0, nameIndex) +
                        "<strong>" + item.name.substring(nameIndex, nameIndex + val.length) + "</strong>" +
                        item.name.substring(nameIndex + val.length);
        } else {
          displayText = item.code + " - " + item.name;
        }

        itemDiv.innerHTML = displayText;

        itemDiv.addEventListener("click", function() {
          inp.value = item.code + " - " + item.name;
          closeAllLists();
        });
        listContainer.appendChild(itemDiv);
      }
    });
  });

  inp.addEventListener("keydown", function(e) {
    let x = document.querySelector(".autocomplete-items");
    if (x) x = x.getElementsByClassName("autocomplete-item");
    if (e.key === "ArrowDown") {
      currentFocus++;
      addActive(x);
    } else if (e.key === "ArrowUp") {
      currentFocus--;
      addActive(x);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (const item of x) {
      item.classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    const items = document.getElementsByClassName("autocomplete-items");
    for (const item of items) {
      if (elmnt !== item && elmnt !== inp) {
        item.parentNode.removeChild(item);
      }
    }
  }

  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}

// Initialize autocomplete on page load
document.addEventListener("DOMContentLoaded", () => {
  autocomplete(document.getElementById("countryInput"), countries);
//   autocomplete(document.getElementById("countryInput"), countriesArray); // your countries list

document.getElementById("countryInput").addEventListener("input", function () {
  filterTable(12, this.value);
});

});
