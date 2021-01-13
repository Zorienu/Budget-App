// manage the data of the application
const budgetController = (function () {
  let budgetStore = {
    income: [],
    expenses: [],
  };
})();

// used for obtain input data and update UI
const UIController = (function () {
  const UIElements = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
  };

  const getInput = () => {
    const type = document.querySelector(".add__type").value;
    const description = document.querySelector(".add__description").value;
    const value = document.querySelector(".add__value").value;

    return { type, description, value };
  };

  return {
    UIElements,
    getInput,
  };
})();

// connect the budgetController and the UIController
const controller = (function (budgetCtrl, UICtrl) {
  const setupEventListeners = () => {
    const UIElements = UICtrl.UIElements;
    // add event to input btn
    document
      .querySelector(UIElements.inputButton)
      .addEventListener("click", ctrlAddItem);
  };

  const ctrlAddItem = () => {
    const input = UICtrl.getInput();
    console.log(input);
  };

  return {
    init: () => {
      console.log("start");
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
