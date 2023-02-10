const filtersContainer = document.getElementById("filtered-tags-container");
const filteredTags = document.querySelector(".filtered-tags");
const clearBtn = document.querySelector(".clear-btn");
const mainContainer = document.getElementById("main-container");

let http = new XMLHttpRequest();
http.open("get", "data.json", true);
http.send();
http.onload = function () {
  if (this.readyState == 4 && this.status == 200) {
    let data = JSON.parse(this.responseText);
    let output = "";
    for (let item of data) {
      output += `
         <section class="job">
         <div class="company">
           <img
             src="${item.logo}"
             class="company-logo"
             alt="Company Logo"
           />
           <div class="company-info">
             <div class="company-name-wrapper">
               <h3 class="company-name">${item.company}</h3>
               <span class="new-tag"></span>
               <span class="featured-tag"></span>
             </div>
             <h2 class="position">${item.position}</h2>
             <div class="job-info">
               <span class="time-posted">${item.postedAt}</span>
               <div class="spacer-dot"></div>
               <span class="contract">${item.contract}</span>
               <div class="spacer-dot"></div>
               <span class="location">${item.location}</span>
             </div>
           </div>
         </div>
 
         <div class="mobile-divider"></div>
 
         <div class="tags">
           <span class="tag">${item.role}</span>
           <span class="tag">${item.level}</span>
           <span class="tag">${item.tools[0]}</span>
           <span class="tag">${item.tools[1]}</span>
           <span class="tag">${item.tools[2]}</span>
         </div>
       </section>
         `;
    }
    mainContainer.innerHTML = output;
  }

  const jobs = mainContainer.querySelectorAll(".job");
  const tags = mainContainer.querySelectorAll(".tag");

  tags.forEach((tag) => {
    if (tag.innerText === "undefined") {
      tag.style.display = "none";
    }
  });

  let filters = [];

  filtersContainer.style.display = "none";

  function deselect() {
    tags.forEach((tag) => {
      if (filters.every((f) => !tag.innerText.match(f.innerText))) {
        tag.style.background = "var(--background)";
        tag.style.color = "var(--desaturated-dark-cyan)";
        tag.style.pointerEvents = "all";
        tag.addEventListener("mouseover", () => {
          tag.style.background = "var(--desaturated-dark-cyan)";
          tag.style.color = "#fff";
        });
        tag.addEventListener("mouseout", () => {
          tag.style.background = "var(--background)";
          tag.style.color = "var(--desaturated-dark-cyan)";
        });
      }
    });
  }

  tags.forEach((tag) => {
    tag.addEventListener("click", () => {
      filtersContainer.style.display = "flex";
      filters.push(tag);
      filters.forEach((f) => {
        tags.forEach((tag) => {
          if (tag.innerText.match(f.innerText)) {
            tag.style.background = "var(--desaturated-dark-cyan)";
            tag.style.color = "#fff";
            tag.style.pointerEvents = "none";
            tag.addEventListener("mouseout", () => {
              tag.style.background = "var(--desaturated-dark-cyan)";
              tag.style.color = "#fff";
            });
          }
        });
      });
      const filter = document.createElement("div");
      filter.classList.add("filter");
      filter.innerHTML = `
      <span class="filter-name">${tag.innerText}</span>
      <button type="button" class="remove-btn">
        <img
          src="images/icon-remove.svg"
          alt="Icon Remove"
        />
      </button>
      `;
      filteredTags.appendChild(filter);
      const removeBtn = filter.querySelector(".remove-btn");

      jobs.forEach((job) => {
        if (!job.innerText.match(tag.innerText)) {
          job.style.display = "none";
        }
      });

      removeBtn.addEventListener("click", () => {
        filter.style.display = "none";
        filters.splice(filters.indexOf(tag), 1);
        jobs.forEach((job) => {
          if (filters.every((f) => job.innerText.match(f.innerText))) {
            job.style.display = "flex";
          }
        });
        if (filters.length === 0) {
          jobs.forEach((job) => {
            job.style.display = "flex";
          });
          filtersContainer.style.display = "none";
          deselect();
        }
        deselect();
      });

      clearBtn.addEventListener("click", () => {
        filteredTags.removeChild(filter);
        filters = [];
        filtersContainer.style.display = "none";
        jobs.forEach((job) => {
          job.style.display = "flex";
        });
        deselect();
      });
    });
  });
};
