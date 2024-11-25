export enum LogType {
  SUCCESS = "success",
  INFO = "info",
  ERROR = "error",
  START = "start",
  WARNING = "warning",
  END = "end",
}

export function customLogger(message: string, type?: LogType) {
  let color = type?.toString() || "black";
  let bgc = "White";

  switch (color) {
    case "success":
      color = "Green";
      bgc = "LimeGreen";
      break;
    case "info":
      color = "DodgerBlue";
      bgc = "Turquoise";
      break;
    case "error":
      color = "Red";
      bgc = "Black";
      break;
    case "warning":
      color = "#ed691c";
      bgc = "Orange";
      break;
    case "start":
      color = "OliveDrab";
      bgc = "PaleGreen";
      break;
    case "end":
      color = "Orchid";
      bgc = "MediumVioletRed";
      break;
  }

  if (typeof message == "object") {
    console.log(message);
  } else if (typeof color == "object") {
    console.log(
      "%c" + message,
      "color: PowderBlue;font-weight:bold; background-color: RoyalBlue;"
    );
    console.log(color);
  } else {
    console.log(
      "%c" + message,
      "color:" + color + ";font-weight:bold; background-color: " + bgc + ";"
    );
  }
}
