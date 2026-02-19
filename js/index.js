// ==================
// Application State
// ==================
const state = {
  step: 1,
  formData: {
    name: "",
    email: "",
    phone: "",
    plan: "",
    basePrice: 0,
    addons: [],
    billing: "monthly",
  },
};

// ==================
// Prices (Logic only)
// ==================
const PLANS_PRICES = {
  arcade: { monthly: 9, yearly: 90 },
  advanced: { monthly: 12, yearly: 120 },
  pro: { monthly: 15, yearly: 150 },
};

const ADDONS_PRICES = {
  support: { monthly: 1, yearly: 10 },
  storage: { monthly: 2, yearly: 20 },
  reports: { monthly: 2, yearly: 20 },
};

// ==================
// Selectors
// ==================
const numbers = document.querySelectorAll(".number");
const btnNext = document.querySelector(".btn-main");
const btnBack = document.querySelector(".btn");
const main = document.querySelector(".main");
const change = document.querySelector(".btn-change-end");
const footer = document.querySelector(".footer");
// ==================
// Render Controller
// ==================
function render() {
  updateStepsUI();
  renderStep();
  toggleNextButton();
  toggleBackButton();
}

// ==================
// UI Helpers
// ==================
function updateStepsUI() {
  numbers.forEach((num, index) => {
    num.classList.toggle("active", index + 1 === state.step);
  });
}

function toggleBackButton() {
  btnBack.style.visibility = state.step === 1 ? "hidden" : "visible";
}
function toggleNextButton() {
  btnNext.style.display = state.step === 5 ? "none" : "block";
  footer.style.display = state.step === 5 ? "none" : "flex";
}
function validateField(field, value) {
  const rule = VALIDATORS[field];
  if (!rule) return true;

  return rule.regex.test(value.trim());
}

// ==================
// Step Renderer
// ==================
function renderStep() {
  main.innerHTML = "";

  let content;
  switch (state.step) {
    case 1:
      content = stepOne();
      break;
    case 2:
      content = stepTwo();
      break;
    case 3:
      content = stepThree();
      break;
    case 4:
      content = stepFour();
      break;
    case 5:
      content = stepFive();
      break;
  }

  main.appendChild(content);
}

// ==================
// Helpers
// ==================
function calculateTotal() {
  let total = state.formData.basePrice;

  state.formData.addons.forEach((addon) => {
    total += ADDONS_PRICES[addon][state.formData.billing];
  });

  return total;
}

// ==================
// Validation Rules
// ==================

const VALIDATORS = {
  name: {
    regex: /^[A-Za-z\s]{3,30}$/,
    message: "Name must be 3-30 characters, letters only.",
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    message: "Please enter a valid email address.",
  },
  phone: {
    regex: /^[0-9\-+\s]{7,15}$/,
    message: "Phone must be 7-15 digits.",
  },
};
// ==================
// Step Components
// ==================
function stepOne() {
  const div = document.createElement("div");
  div.className = "step";

  div.innerHTML = `
    <h2 class="step-title">Personal info</h2>
    <p class="step-description">
      Please provide your name, email address, and phone number.
    </p>

    <form class="step-form">
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="name" value="${state.formData.name}" placeholder="e.g. Stephen King" required>
        <small class="error-message"></small>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input type="email" id="email" value="${state.formData.email}" placeholder="e.g. stephen.king@lorem.com" required>
        <small class="error-message"></small>
      </div>

      <div class="form-group">
        <label>Phone</label>
        <input type="tel" id="phone" value="${state.formData.phone}" placeholder="e.g. 123-456-7890" required>
        <small class="error-message"></small>
        </div>
    </form>
  `;

  div.querySelector("#name").oninput = (e) =>
    (state.formData.name = e.target.value);
  div.querySelector("#email").oninput = (e) =>
    (state.formData.email = e.target.value);
  div.querySelector("#phone").oninput = (e) =>
    (state.formData.phone = e.target.value);
  ["name", "email", "phone"].forEach((field) => {
    const input = div.querySelector(`#${field}`);
    const error = input.parentElement.querySelector(".error-message");

    input.value = state.formData[field];

    input.oninput = (e) => {
      const value = e.target.value;
      state.formData[field] = value;

      const isValid = validateField(field, value);

      if (!isValid) {
        input.style.border = "2px solid var(--Red-500)";
        error.textContent = VALIDATORS[field].message;
      } else {
        input.style.border = "1px solid var(--Purple-200)";
        error.textContent = "";
      }
    };
  });

  return div;
}

function stepTwo() {
  const div = document.createElement("div");
  div.className = "step";

  div.innerHTML = `
    <h2 class="step-title">Select your plan</h2>
    <p class="step-description-2">You have the option of monthly or yearly billing.</p>

    <div class="plans" id="plans-container">
      <button class="btn-plan-1" data-plan="arcade">
        <div class="plan">
        <img src="./images/icon-arcade.svg" alt="arcade icon"/>
        <div class="plan-info"> 
          <p>Arcade</p>
          <p class="price">${
            state.formData.billing === "monthly" ? "$9/mo" : "$90/yr"
          }</p>
          <span>${state.formData.billing === "yearly" ? "2 months free" : ""}</span>
        </divcla>
        </div>
      </button>

      <button class="btn-plan-2" data-plan="advanced">
        <div class="plan">
        <img src="./images/icon-advanced.svg" alt="advanced icon"/>
         <div class="plan-info"> 
          <p>Advanced</p>
          <p class="price">${
            state.formData.billing === "monthly" ? "$12/mo" : "$120/yr"
          }</p>
          <span>${state.formData.billing === "yearly" ? "2 months free" : ""}</span>
        </div>
        </div>
      </button>

      <button class="btn-plan-3" data-plan="pro">
        <div class="plan">
        <img src="./images/icon-pro.svg" alt="pro icon"/>
         <div class="plan-info"> 
          <p>Pro</p>
          <p class="price">${
            state.formData.billing === "monthly" ? "$15/mo" : "$150/yr"
          }</p>
          <span>${state.formData.billing === "yearly" ? "2 months free" : ""}</span>
        </div>
        </div>
      </button>
    </div>

    <div class="input-check">
      <p>monthly</p>
      <input type="checkbox" id="toggle-billing">
      <p>yearly</p>
    </div>
  `;

  const toggle = div.querySelector("#toggle-billing");
  toggle.checked = state.formData.billing === "yearly";

  toggle.onchange = (e) => {
    state.formData.billing = e.target.checked ? "yearly" : "monthly";

    if (state.formData.plan) {
      state.formData.basePrice =
        PLANS_PRICES[state.formData.plan][state.formData.billing];
    }

    render();
  };

  div.querySelectorAll(".plans button").forEach((btn) => {
    if (btn.dataset.plan === state.formData.plan) {
      btn.style.border = "2px solid var(--Purple-600)";
    }

    btn.onclick = () => {
      state.formData.plan = btn.dataset.plan;
      state.formData.basePrice =
        PLANS_PRICES[btn.dataset.plan][state.formData.billing];
      render();
    };
  });

  return div;
}

function stepThree() {
  const div = document.createElement("div");
  div.className = "step";

  div.innerHTML = `
    <h2 class="step-title">pick Add-ons</h2>
    <p class="step-description">add-ons help enhance your experience.</p>

    <div class="div-addon">
      <input type="checkbox" value="support">
      <span>Online Services <span class="addon-desc">access to multiplayer games</span></span>
      <span class="addon-price">${
        state.formData.billing === "monthly" ? "+$1/mo" : "+$10/yr"
      }</span>
    </div>

    <div class="div-addon">
      <input type="checkbox" value="storage">
      <span>Large Storage<span class="addon-desc">extra 1TB of cloud save</span></span>
      <span class="addon-price">${
        state.formData.billing === "monthly" ? "+$2/mo" : "+$20/yr"
      }</span>
    </div>

    <div class="div-addon">
      <input type="checkbox" value="reports">
      <span>Advanced Reports <span class="addon-desc">custom theme on your profile</span></span>
      <span class="addon-price">${
        state.formData.billing === "monthly" ? "+$2/mo" : "+$20/yr"
      }</span>
    </div>
  `;

  div.querySelectorAll("input[type='checkbox']").forEach((cb) => {
    cb.checked = state.formData.addons.includes(cb.value);

    cb.onchange = (e) => {
      if (e.target.checked) {
        state.formData.addons.push(e.target.value);
      } else {
        state.formData.addons = state.formData.addons.filter(
          (a) => a !== e.target.value,
        );
      }
    };
  });

  return div;
}

function stepFour() {
  const div = document.createElement("div");
  div.className = "step";

  const total = calculateTotal();

  div.innerHTML = `
    <h2 class="step-title">Finishing up</h2>
    <p class="step-four-description">Double-check everything looks OK before confirming.</p>
    <ul class="summary">
      <li class="main-li">
     <div class="main-li-div" > ${state.formData.plan}
      <a class="btn-change-end" href="#plans-container">Change</a></div>
      $${state.formData.basePrice}/${state.formData.billing === "monthly" ? "mo" : "yr"}
      </li>
      <hr/>
      
     <li>
  ${
    state.formData.addons.length
      ? `<ul class="addons-list">
       ${state.formData.addons
         .map((addon) => {
           const price = ADDONS_PRICES[addon][state.formData.billing];
           const suffix = state.formData.billing === "monthly" ? "mo" : "yr";

           return `
    <li class="addon-item">
      <span>${addon}</span>
      <span>+$${price}/${suffix}</span>
    </li>
  `;
         })
         .join("")}
      </ul>`
      : "None"
  }
</li>
    </ul>

    <h3>Total: <strong>$${total}/${state.formData.billing}</strong></h3>
  `;

  return div;
}

function stepFive() {
  const div = document.createElement("div");
  div.className = "step";
  div.innerHTML = `
    <div class="thank-you">
    <img src="./images/icon-thank-you.svg" alt="thank you icon"/>
    <h2>Thank you!</h2>
    <p>Thanks for confirming your subscription! We hope you have fun using our platform. If you ever need support, please feel free to email us at
    support@loremgaming.com
    </p>
    
    </div>
  `;
  return div;
}

// ==================
// Events
// ==================
btnNext.onclick = () => {
  if (state.step === 1) {
    const isValidForm = ["name", "email", "phone"].every((field) =>
      validateField(field, state.formData[field]),
    );

    if (!isValidForm) {
      alert("Please fix the errors before continuing.");
      return;
    }
  }

  state.step++;
  render();
};

btnBack.onclick = () => {
  if (state.step > 1) {
    state.step--;
    render();
  }
};

main.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-change-end")) {
    e.preventDefault();
    state.step = 2;
    render();
  }
});

// ==================
// Initial Render
// ==================
render();
