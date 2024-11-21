import { useState } from "react";
import regression from "regression";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  const [coords, setCoords] = useState([{ x: 0, y: 0 }]);
  const [labelType, setLabelType] = useState("Nenhum gráfico formado");
  const [law, setLaw] = useState("");
  const [data, setData] = useState([]);

  function bestFitModel(points) {
    const linear = regression.linear(points);
    const exponential = regression.exponential(points);
    const logarithmic = regression.logarithmic(points);
    const power = regression.power(points);
    const polynomial = regression.polynomial(points, { order: 2 });

    const models = [
      { name: "Linear", model: linear },
      { name: "Exponencial", model: exponential },
      { name: "Logarítmica", model: logarithmic },
      { name: "Potência", model: power },
      { name: "Polinomial", model: polynomial },
    ];

    let bestModel = models[0];
    models.forEach((model) => {
      if (model.model.r2 > bestModel.model.r2) {
        bestModel = model;
      }
    });

    setLaw(bestModel.model.string);
    return bestModel;
  }

  function handleVerify() {
    const points = coords.map((coord) => [coord.x, coord.y]);
    const bestModel = bestFitModel(points);
    setLabelType(bestModel.name);

    const modelData = bestModel.model.points.map((point) => ({
      x: point[0],
      y: point[1],
    }));
    setData(modelData);
  }

  const removerUltimaLinha = () => {
    if (coords.length > 1) {
      setCoords(coords.slice(0, -1));
    }
  };

  const addRow = () => {
    setCoords([...coords, { x: 0, y: 0 }]);
  };

  const handleCoordChange = (index, axis, value) => {
    const updatedCoords = coords.map((coord, i) =>
      i === index ? { ...coord, [axis]: Number(value) } : coord
    );
    setCoords(updatedCoords);
  };

  return (
    <div className="w-full h-screen p-6 bg-gray-100 text-gray-900 flex">
      <div className="w-2/5 flex flex-col items-center justify-center">
        <table className="table-fixed border-collapse border border-gray-300 bg-white shadow-md">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">X</th>
              <th className="border border-gray-300 px-4 py-2">Y</th>
            </tr>
          </thead>
          <tbody>
            {coords.map((coord, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={coord.x}
                    onChange={(e) =>
                      handleCoordChange(index, "x", e.target.value)
                    }
                    className="w-full p-2 bg-gray-50 text-gray-900 rounded border border-gray-300"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={coord.y}
                    onChange={(e) =>
                      handleCoordChange(index, "y", e.target.value)
                    }
                    className="w-full p-2 bg-gray-50 text-gray-900 rounded border border-gray-300"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4 mt-4">
          <button
            onClick={addRow}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white shadow-md"
          >
            Adicionar Linha
          </button>
          <button
            onClick={handleVerify}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white shadow-md"
          >
            Verificar
          </button>
          <button
            onClick={removerUltimaLinha}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white shadow-md"
          >
            Remover Última Linha
          </button>
        </div>
      </div>

      <div className="w-3/5 flex flex-col items-center justify-center border border-gray-300 bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-center">{labelType}</h3>
        <h3 className="text-lg mb-4 text-center">{law}</h3>

        <div
          style={{
            width: "100%",
            maxWidth: "750px",
            height: "750px",
            margin: "0 auto",
          }}
        >
          <Line
            data={{
              datasets: [
                {
                  label: `${labelType} Model`,
                  data: data,
                  borderColor: "rgba(75,192,192,1)",
                  backgroundColor: "rgba(75,192,192,0.2)",
                  tension: 0.2,
                  parsing: {
                    xAxisKey: "x",
                    yAxisKey: "y",
                  },
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 1,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                  labels: {
                    color: "#333",
                    font: {
                      size: 14,
                      family: "Arial, sans-serif",
                    },
                    padding: 20,
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  padding: 10,
                  cornerRadius: 4,
                  displayColors: false,
                },
                title: {
                  display: true,
                  text: "Título do Gráfico",
                  color: "#333",
                  font: {
                    size: 18,
                    weight: "bold",
                    family: "Arial, sans-serif",
                  },
                  padding: 20,
                },
              },
              scales: {
                x: {
                  type: "linear",
                  grid: {
                    display: true,
                    color: "rgba(200, 200, 200, 0.2)",
                  },
                  ticks: {
                    color: "#666",
                    font: {
                      size: 12,
                    },
                  },
                  title: {
                    display: true,
                    text: "Eixo X",
                    color: "#333",
                    font: {
                      size: 14,
                      family: "Arial, sans-serif",
                    },
                  },
                },
                y: {
                  type: "linear",
                  grid: {
                    display: true,
                    color: "rgba(200, 200, 200, 0.2)",
                  },
                  ticks: {
                    color: "#666",
                    font: {
                      size: 12,
                    },
                    callback: function (value) {
                      return value.toLocaleString();
                    },
                  },
                  title: {
                    display: true,
                    text: "Eixo Y",
                    color: "#333",
                    font: {
                      size: 14,
                      family: "Arial, sans-serif",
                    },
                  },
                },
              },
              layout: {
                padding: {
                  left: 20,
                  right: 20,
                  top: 20,
                  bottom: 20,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
