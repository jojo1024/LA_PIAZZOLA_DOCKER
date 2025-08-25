import Chart from "../../../base-components/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "../../../utils/colors";
import { selectColorScheme } from "../../../stores/colorSchemeSlice";
import { selectDarkMode } from "../../../stores/darkModeSlice";
import { useAppSelector } from "../../../stores/hooks";
import { useMemo } from "react";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width: number;
  height: number;
  labels: string[];
  data: number[];
  datasetLabel: string
}

function Main(props: MainProps) {
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);



  const data: ChartData = useMemo(() => {
    return {
      labels: [
        "Jan", "Fev", "Mar", "Avr", "Mai", "Jui",
        "Juil", "Aou", "Sep", "Oct", "Nov", "Dec",
    ],
      datasets: [
        {
          label: props.datasetLabel,
          data: props.data,
          borderWidth: 2,
          borderColor: colorScheme ? getColor("primary", 0.8) : "",

          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4,
        },

      ],
    };
  }, [colorScheme, darkMode, props.data]);

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 12,
            },
            color: getColor("slate.500", 0.8),
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            font: {
              size: 12,
            },
            color: getColor("slate.500", 0.8),
            callback: function (value) {
              return  value;
            },
          },
          grid: {
            color: darkMode
              ? getColor("slate.500", 0.3)
              : getColor("slate.300"),
            borderDash: [2, 2],
            drawBorder: false,
          },
        },
      },
    };
  }, [colorScheme, darkMode]);

  return (
    <Chart
      type="line"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  );
}

Main.defaultProps = {
  width: "auto",
  height: "auto",
  className: "",
};

export default Main;
