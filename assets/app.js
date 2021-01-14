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

  const addItem = (item) => {
    const newItem = new BudgetItem(item.id, item.description, item.value);
    budgetStore.items[item.type].push(newItem);
  };

  const deleteItem = () => {
    // delete an item given the id and the type
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
  };

  const getInput = () => {
    const type = document.querySelector(UIElements.inputType).value;
    const description = document.querySelector(UIElements.inputDescription).value;
    const value = parseFloat(document.querySelector(UIElements.inputValue).value);
    const id = 1;
    return { type, id, description, value };
  };

  const stringToHTML = (s) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(s, "text/html");
    return doc.body.firstChild;
  };

  const addItem = (item) => {
    const list = document.querySelector(`.${item.type}__list`);
    const element = stringToHTML(`
			<div class="item clearfix" id="${item.type}-${item.id}">
				<div class="item__description">${item.description}</div>
				<div class="right clearfix">
					<div class="item__value" data-value="${item.value}">${item.value}</div>
					${item.type === "expenses" ? '<div class="item__percentage">0%</div>' : ""}
					<div class="item__delete">
						<button class="item__delete--btn">
							<i class="ion-ios-close-outline" data-item="${item.type}-${item.id}">
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
    console.log(obj.percentage);
  };
  return {
    UIElements,
    getInput,
    addItem,
    displayBudget,
  };
})();

// connect the budgetController and the UIController
const controller = (function (budgetCtrl, UICtrl) {
  const setupEventListeners = () => {
    const UIElements = UICtrl.UIElements;
    // add event to input btn
    document.querySelector(UIElements.inputButton).addEventListener("click", ctrlAddItem);
  };

  const updateBudget = () => {
    budgetCtrl.updateBudget();
    const budget = budgetCtrl.getBudgetState();
    UICtrl.displayBudget(budget);
  };

  const ctrlAddItem = () => {
    const input = UICtrl.getInput();
    budgetCtrl.addItem(input); // add item to storage
    UICtrl.addItem(input); // add item to UI
    updateBudget();
  };

  return {
    init: () => {
      console.log("start");
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
