const FormattedDate = (date) => {
  const [year, month, day] = date.split("-");
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
};

const myFlightDate = (flightTime) =>{
  const date = flightTime.split("T")[0];
  const [year, month, day] = date.split("-");
  const myFormattedFlightDate = `${day}-${month}-${year}`;
  return myFormattedFlightDate;
}

export {FormattedDate ,myFlightDate};