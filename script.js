document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-container");
  const inputsContainer = document.querySelector(".inputs-container");
  const chartContainer = document.querySelector(".expenses-container");
  const yearSelected = document.querySelector("#year");
  const monthSelected = document.querySelector("#month");
  const amountInput = document.querySelector("#amount");
  const chartCanva = document.querySelector("#expense-chart");

  let month, year, myChart;

  //?generate years
  for (let year = 2025; year <= 2040; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelected.appendChild(option);
  }

  //?templating expense for each month

  const expenses = {
    january: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    february: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    march: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    april: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    may: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    june: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    july: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    august: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    september: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    october: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    november: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
    december: {
      housing: 0,
      food: 0,
      transportation: 0,
      miscellaneuos: 0,
      bills: 0,
    },
  };

  //?set current year and month as default

  function setDefaultDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(new Date(year, month, date.getDate()));

    yearSelected.value = year;
    monthSelected.value = monthName.toLocaleLowerCase();
    amountInput.value = "";
    document.querySelector("#category").value = "housing";
  }
  setDefaultDate();

  //?form submission

  form.addEventListener("submit", handleSubmit);
  monthSelected.addEventListener("change", updatePieChart);
  yearSelected.addEventListener("change", updatePieChart);

  function handleSubmit(e) {
    e.preventDefault();
    getSelectedYearMonth();
    const amount = amountInput.value;
    const category = document.querySelector("#category").value;

    const existedAmount = expenses[month][category];
    if (amount) {
      expenses[month][category] = parseFloat(amount) + existedAmount;
    } else if (amount < 0 && existedAmount >= Math.abs(amount)) {
      expenses[month][category] = existedAmount + parseFloat(amount);
    }
    if (amount < 0 && existedAmount < Math.abs(amount)) {
      alert("expense amount is invalid!");
      return;
    }

    //?saving to local storage
    saveExpensesToLocalStorage(month, year);

    console.log(expenses[month]);
    updatePieChart();

    //?reset form
    setDefaultDate();
  }

  //?UPDATE EXPENSE OBJECT AND SAVE TO LOCAL STORAGE
  function getExpensesFromLocalStorage(month, year) {
    console.log(month, year);

    const key = `${month}-${year}`;
    return JSON.parse(localStorage.getItem(key)) || {};
  }

  function saveExpensesToLocalStorage(month, year) {
    console.log(month, year);
    const key = `${month}-${year}`;
    localStorage.setItem(key, JSON.stringify(expenses[month]));
  }

  function getSelectedYearMonth() {
    month = monthSelected.value;
    year = yearSelected.value;

    if (!category || !year || !month) {
      alert("Either year or month is zero!");
      return;
    }

    if (!expenses[month]) {
      expenses[month][category] = {
        housing: 0,
        food: 0,
        transportation: 0,
        miscellaneuos: 0,
        bills: 0,
      };
    }
  }

  function updatePieChart() {
    getSelectedYearMonth();
    const ctx = document.getElementById("expense-chart").getContext("2d");

    const expenseFromLS = getExpensesFromLocalStorage(month, year);
    Object.assign(expenses[month], expenseFromLS);

    if (myChart) {
      myChart.destroy();
    }
    const data = {
      labels: Object.keys(expenses[month]),
      datasets: [
        {
          label: "Expenses",
          data: Object.values(expenses[month]),
          backgroundColor: [
            "#ff6384",
            "#4caf50",
            "#ffcd56",
            "#36a2eb",
            "#ff9f40",
          ],
        },
      ],
    };

    const config = {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            display: true,
          },
          toolbar: {
            display: true,
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              label: function (context) {
                return context.label + ": " + context.parsed + " $";
              },
            },
          },
        },
      },
    };

    myChart = new Chart(ctx, config);
  }

  updatePieChart();
});
