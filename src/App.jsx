import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression from "regression";

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
    return bestModel.name;
  }

  function handleVerify() {
    const points = coords.map(coord => [coord.x, coord.y]);
    const model = bestFitModel(points);
    setLabelType(model);
    setData(points.map((point) => ({ x: point[0], y: point[1] })));
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
                    onChange={(e) => handleCoordChange(index, "x", e.target.value)}
                    className="w-full p-2 bg-gray-50 text-gray-900 rounded border border-gray-300"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={coord.y}
                    onChange={(e) => handleCoordChange(index, "y", e.target.value)}
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

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="y" stroke="#4A90E2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
