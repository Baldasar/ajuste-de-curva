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

  const limpar = () => {
    setCoords([{ x: 0, y: 0 }]);
    setLabelType("Nenhum gráfico formado");
    setLaw("");
    setData([]);
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

  const minValue = Math.min(...data.map((point) => Math.min(point.x, point.y)));
  const maxValue = Math.max(...data.map((point) => Math.max(point.x, point.y)));

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
            onClick={limpar}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white shadow-md"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="w-3/5 flex flex-col items-center justify-center border border-gray-300 bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-center">{labelType}</h3>
        <h3 className="text-lg mb-4 text-center">{law}</h3>

        {data.length > 1 && (
          <div style={{ width: "80%", height: "400px" }}>
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
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: '#333',
                      font: {
                        size: 14,
                        family: 'Arial, sans-serif'
                      },
                      padding: 20
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 10,
                    cornerRadius: 4,
                    displayColors: false
                  },
                  title: {
                    display: true,
                    text: 'Título do Gráfico',
                    color: '#333',
                    font: {
                      size: 18,
                      weight: 'bold',
                      family: 'Arial, sans-serif'
                    },
                    padding: 20
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      color: '#666',
                      font: {
                        size: 12
                      }
                    }
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(200, 200, 200, 0.2)'
                    },
                    ticks: {
                      color: '#666',
                      font: {
                        size: 12
                      },
                      callback: function (value) {
                        return value.toLocaleString();
                      }
                    }
                  }
                },
                layout: {
                  padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                  }
                }
              }}
              // options={{
                
              //   maintainAspectRatio: false,
              //   aspectRatio: 1, // Garante que os eixos tenham a mesma proporção
              //   scales: {
              //     x: {
              //       type: "linear",
              //       title: { display: true, text: "X" },
              //       min: minValue,
              //       max: maxValue,
              //     },
              //     y: {
              //       title: { display: true, text: "Y" },
              //       min: minValue,
              //       max: maxValue,
              //     },
              //   },
              // }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
