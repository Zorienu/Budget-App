// manage the data of the application
const budgetController = (function () {
  let budgetStore = {
    items: {
      income: [],
      expenses: [],
    },
    totals: {
      income: 0,
      expenses: 0,
    },
    totalBudget: 0,
    percentage: -1,
  };

  // constructor for income of expense
  const BudgetItem = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const getBudgetState = () => {
    return {
      totalIncome: budgetStore.totals.income,
      totalExpenses: budgetStore.totals.expenses,
      totalBudget: budgetStore.totalBudget,
      percentage: budgetStore.percentage,
    };
  };

  const generateId = () => {
    return Date.now().toString(36);
  };

  const addItem = (item) => {
    const id = generateId();
    const newItem = new BudgetItem(id, item.description, item.value);
    budgetStore.items[item.type].push(newItem);
    return newItem;
  };

  const deleteItem = (item) => {
    const type = item.split("-")[0];
    const id = item.split("-")[1];
    const index = budgetStore.items[type].map((i) => i.id).indexOf(id); // obtain the index of the item to delete
    budgetStore.items[type].splice(index, 1);
  };

  const updateBudget = () => {
    budgetStore.totals.expenses = budgetStore.items.expenses.reduce((sum, item) => sum + item.value, 0);
    budgetStore.totals.income = budgetStore.items.income.reduce((sum, item) => sum + item.value, 0);
    budgetStore.totalBudget = budgetStore.totals.income - budgetStore.totals.expenses;

    budgetStore.percentage = (budgetStore.totals.expenses / budgetStore.totals.income) * 100;
  };

  const test = () => console.log(budgetStore);

  return {
    getBudgetState,
    addItem,
    deleteItem,
    updateBudget,
    test,
  };
})();

// used for obtain input data and update UI
const UIController = (function () {
  const UIElements = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    budgetValue: ".budget__value",
    budgetIncome: ".budget__income--value",
    budgetExpenses: ".budget__expenses--value",
    budgetPercentage: ".budget__expenses--percentage",
    container: ".container",
    date: ".budget__title--month",
  };

  const getInput = () => {
    const type = document.querySelector(UIElements.inputType).value;
    const description = document.querySelector(UIElements.inputDescription).value;
    const value = parseFloat(document.querySelector(UIElements.inputValue).value);
    return { type, description, value };
  };

  const stringToHTML = (s) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(s, "text/html");
    return doc.body.firstChild;
  };

  const addItem = (item, type) => {
    const list = document.querySelector(`.${type}__list`);
    const element = stringToHTML(`
			<div class="item clearfix" id="${type}-${item.id}">
				<div class="item__description">${item.description}</div>
				<div class="right clearfix">
					<div class="item__value" data-value="${item.value}">${item.value}</div>
					${item.type === "expenses" ? '<div class="item__percentage">0%</div>' : ""}
					<div class="item__delete">
						<button class="item__delete--btn">
							<i class="ion-ios-close-outline" data-item="${type}-${item.id}">
							</i>
						</button>
					</div>
				</div>
			</div>
    `);
    list.appendChild(element);
  };

  const formatNumber = (num) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const displayBudget = (obj) => {
    const budgetElement = document.querySelector(UIElements.budgetValue);
    const budgetIncome = document.querySelector(UIElements.budgetIncome);
    const budgetExpenses = document.querySelector(UIElements.budgetExpenses);
    const budgetPercentage = document.querySelector(UIElements.budgetPercentage);

    budgetElement.textContent = formatNumber(obj.totalBudget);
    budgetIncome.textContent = formatNumber(obj.totalIncome);
    budgetExpenses.textContent = formatNumber(obj.totalExpenses);
    budgetPercentage.textContent = obj.percentage >= 0 ? `${Math.round(obj.percentage)}%` : "---";
  };

  const deleteListItem = (item) => {
    document.getElementById(item).remove();
  };

  const displayDate = () => {
    const monthsNames = ["January", "February", "March", "April", "May", "June", "July", "August", "October", "November", "December"];
    const d = new Date();
    const dateElement = document.querySelector(UIElements.date);
    dateElement.textContent = `${monthsNames[d.getMonth()]}, ${d.getFullYear()}`;
  };

  return {
    UIElements,
    getInput,
    addItem,
    displayBudget,
    deleteListItem,
    displayDate,
  };
})();

// connect the budgetController and the UIController
const controller = (function (budgetCtrl, UICtrl) {
  const setupEventListeners = () => {
    const UIElements = UICtrl.UIElements;
    // add event to input btn
    document.querySelector(UIElements.inputButton).addEventListener("click", ctrlAddItem);
    // change color inputs
    document.querySelector(UIElements.inputType).addEventListener("change", ctrlChangeInputBorderColor);
    // setup event handler for container to delete items
    document.querySelector(UIElements.container).addEventListener("click", ctrlDeleteItem);
  };

  const updateBudget = () => {
    budgetCtrl.updateBudget();
    const budget = budgetCtrl.getBudgetState();
    UICtrl.displayBudget(budget);
  };

  const ctrlAddItem = () => {
    const input = UICtrl.getInput();
    const newItem = budgetCtrl.addItem(input); // add item to storage
    UICtrl.addItem(newItem, input.type); // add item to UI
    updateBudget();
  };

  const ctrlChangeInputBorderColor = () => {
    // call various classes at the same time ( returns an array )
    const inputs = document.querySelectorAll(
      UICtrl.UIElements.inputType + ", " + UICtrl.UIElements.inputDescription + ", " + UICtrl.UIElements.inputValue
    );
    inputs.forEach((input) => input.classList.toggle("red-focus"));

    // toggle color of the add button
    document.querySelector(UICtrl.UIElements.inputButton).classList.toggle("red");
  };

  const ctrlDeleteItem = (e) => {
    if (e.target.nodeName === "I") {
      const item = e.target.dataset.item; // string "type-id" item
      budgetCtrl.deleteItem(item);
      UICtrl.deleteListItem(item); // delete item from DOM
      updateBudget();
    }
  };

  return {
    init: () => {
      console.log("start");
      UICtrl.displayDate();
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
